import { NextRequest, NextResponse } from 'next/server';
import { ensureDatabaseInitialized, getPool } from '@/lib/db';
import { autoTranslateCmsFields } from '@/lib/translator';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized();
    const db = getPool();
    const { id } = await context.params;
    const itemId = Number(id);

    if (Number.isNaN(itemId)) {
      return NextResponse.json({ ok: false, error: 'ID inválido' }, { status: 400 });
    }

    const existingRes = await db.query('SELECT * FROM cms_items WHERE id = $1', [itemId]);
    if (existingRes.rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'El elemento no existe en la base de datos.' },
        { status: 404 }
      );
    }

    const prev = existingRes.rows[0];
    const body = await req.json();

    const page = body.page ?? prev.page;
    const section = body.section ?? prev.section;
    const content_type = body.content_type ?? prev.content_type;
    const title_en = body.title_en ?? body.title ?? prev.title_en;
    const subtitle_en = body.subtitle_en ?? body.subtitle ?? prev.subtitle_en;
    const description_en = body.description_en ?? body.description ?? prev.description_en;
    const badge_en = body.badge_en ?? body.badge ?? prev.badge_en;
    const cta_text_en = body.cta_text_en ?? body.cta_text ?? prev.cta_text_en;

    // Automatic translation if English text changed and Spanish is not provided explicitly
    let title_es = body.title_es ?? prev.title_es;
    let subtitle_es = body.subtitle_es ?? prev.subtitle_es;
    let description_es = body.description_es ?? prev.description_es;
    let badge_es = body.badge_es ?? prev.badge_es;
    let cta_text_es = body.cta_text_es ?? prev.cta_text_es;

    const titleChanged = title_en !== prev.title_en;
    const descChanged = description_en !== prev.description_en;

    if (!body.title_es && titleChanged) {
      const translated = await autoTranslateCmsFields({
        title_en,
        subtitle_en,
        description_en,
        badge_en,
        cta_text_en,
      });
      title_es = translated.title_es || title_en;
      if (subtitle_en) subtitle_es = translated.subtitle_es || subtitle_en;
      if (description_en && descChanged) description_es = translated.description_es || description_en;
      if (badge_en) badge_es = translated.badge_es || badge_en;
      if (cta_text_en) cta_text_es = translated.cta_text_es || cta_text_en;
    }

    const media_url = body.media_url ?? prev.media_url;
    const media_type = body.media_type ?? prev.media_type;
    const cta_link = body.cta_link ?? prev.cta_link;
    const meta_json = body.meta_json ?? prev.meta_json ?? {};
    const display_order =
      body.display_order !== undefined ? Number(body.display_order) : prev.display_order;
    const status = body.status ?? prev.status;
    const updated_by = body.changed_by || 'Admin NARA';

    const updateRes = await db.query(
      `UPDATE cms_items
       SET page = $1,
           section = $2,
           content_type = $3,
           title_en = $4,
           title_es = $5,
           subtitle_en = $6,
           subtitle_es = $7,
           description_en = $8,
           description_es = $9,
           media_url = $10,
           media_type = $11,
           badge_en = $12,
           badge_es = $13,
           cta_text_en = $14,
           cta_text_es = $15,
           cta_link = $16,
           meta_json = $17::jsonb,
           display_order = $18,
           status = $19,
           updated_by = $20,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $21
       RETURNING *`,
      [
        page,
        section,
        content_type,
        title_en,
        title_es,
        subtitle_en,
        subtitle_es,
        description_en,
        description_es,
        media_url,
        media_type,
        badge_en,
        badge_es,
        cta_text_en,
        cta_text_es,
        cta_link,
        JSON.stringify(meta_json),
        display_order,
        status,
        updated_by,
        itemId,
      ]
    );

    const updated = updateRes.rows[0];

    // Determinar tipo de acción para trazabilidad
    let action = 'UPDATED';
    let details = `Contenido editado en sección "${updated.section}".`;

    if (prev.status !== updated.status) {
      if (updated.status === 'active') {
        action = 'ACTIVATED';
        details = `Estado cambiado de INACTIVO a ACTIVO (visible en la página pública).`;
      } else {
        action = 'DEACTIVATED';
        details = `Estado cambiado de ACTIVO a INACTIVO (oculto en la página pública, conservado en trazabilidad).`;
      }
    }

    await db.query(
      `INSERT INTO cms_audit_logs (
        cms_item_id, item_title, page, section, content_type,
        action, previous_status, new_status, changed_by, details, snapshot_json
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb)`,
      [
        updated.id,
        updated.title_es || updated.title_en,
        updated.page,
        updated.section,
        updated.content_type,
        action,
        prev.status,
        updated.status,
        updated_by,
        details,
        JSON.stringify(updated),
      ]
    );

    return NextResponse.json({
      ok: true,
      item: updated,
    });
  } catch (error: unknown) {
    console.error('Error PUT /api/cms/[id]:', error);
    const errMsg = error instanceof Error ? error.message : 'Error al actualizar registro';
    return NextResponse.json({ ok: false, error: errMsg }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized();
    const db = getPool();
    const { id } = await context.params;
    const itemId = Number(id);

    if (Number.isNaN(itemId)) {
      return NextResponse.json({ ok: false, error: 'ID inválido' }, { status: 400 });
    }

    const existingRes = await db.query('SELECT * FROM cms_items WHERE id = $1', [itemId]);
    if (existingRes.rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'El elemento ya no existe.' },
        { status: 404 }
      );
    }

    const itemToDelete = existingRes.rows[0];
    const { searchParams } = new URL(req.url);
    const changedBy = searchParams.get('changed_by') || 'Admin NARA';

    await db.query('DELETE FROM cms_items WHERE id = $1', [itemId]);

    // Guardar registro permanente de eliminación en la tabla de trazabilidad
    await db.query(
      `INSERT INTO cms_audit_logs (
        cms_item_id, item_title, page, section, content_type,
        action, previous_status, new_status, changed_by, details, snapshot_json
      ) VALUES ($1, $2, $3, $4, $5, 'DELETED', $6, 'deleted', $7, $8, $9::jsonb)`,
      [
        itemToDelete.id,
        itemToDelete.title_es || itemToDelete.title_en,
        itemToDelete.page,
        itemToDelete.section,
        itemToDelete.content_type,
        itemToDelete.status,
        changedBy,
        `Elemento eliminado permanentemente de la sección "${itemToDelete.section}". Respaldo conservado en snapshot_json.`,
        JSON.stringify(itemToDelete),
      ]
    );

    return NextResponse.json({
      ok: true,
      deletedId: itemId,
    });
  } catch (error: unknown) {
    console.error('Error DELETE /api/cms/[id]:', error);
    const errMsg = error instanceof Error ? error.message : 'Error al eliminar registro';
    return NextResponse.json({ ok: false, error: errMsg }, { status: 500 });
  }
}

