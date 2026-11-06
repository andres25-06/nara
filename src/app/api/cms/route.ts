import { NextRequest, NextResponse } from 'next/server';
import { ensureDatabaseInitialized, getPool } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseInitialized();
    const db = getPool();

    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');
    const status = searchParams.get('status');
    const contentType = searchParams.get('content_type');
    const includeAudit = searchParams.get('include_audit') === 'true';

    const conditions: string[] = [];
    const values: unknown[] = [];

    if (page && page !== 'all') {
      values.push(page);
      conditions.push(`page = $${values.length}`);
    }
    if (section && section !== 'all') {
      values.push(section);
      conditions.push(`section = $${values.length}`);
    }
    if (status && status !== 'all') {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }
    if (contentType && contentType !== 'all') {
      values.push(contentType);
      conditions.push(`content_type = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const itemsRes = await db.query(
      `SELECT *
       FROM cms_items
       ${whereClause}
       ORDER BY section ASC, display_order ASC, id DESC`,
      values
    );

    let auditLogs = [];
    if (includeAudit) {
      const auditRes = await db.query(
        `SELECT *
         FROM cms_audit_logs
         ORDER BY created_at DESC, id DESC
         LIMIT 150`
      );
      auditLogs = auditRes.rows;
    }

    const statsRes = await db.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'active')::int AS active_count,
        COUNT(*) FILTER (WHERE status = 'inactive')::int AS inactive_count,
        COUNT(*) FILTER (WHERE media_type = 'video' OR content_type = 'video')::int AS videos_count,
        COUNT(*) FILTER (WHERE media_type = 'image' OR content_type = 'image')::int AS images_count
      FROM cms_items
    `);

    return NextResponse.json({
      ok: true,
      items: itemsRes.rows,
      auditLogs,
      stats: statsRes.rows[0] || {
        total: 0,
        active_count: 0,
        inactive_count: 0,
        videos_count: 0,
        images_count: 0,
      },
    });
  } catch (error: unknown) {
    console.error('Error GET /api/cms:', error);
    const errMsg = error instanceof Error ? error.message : 'Error de base de datos';
    return NextResponse.json(
      { ok: false, error: `Error al consultar PostgreSQL (nara): ${errMsg}` },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseInitialized();
    const db = getPool();
    const body = await req.json();

    const page = body.page || 'home';
    const section = body.section || 'videos';
    const content_type = body.content_type || 'card';
    const title_es = (body.title_es || body.title_en || '').trim();
    const title_en = (body.title_en || body.title_es || '').trim();

    if (!title_es && !title_en) {
      return NextResponse.json(
        { ok: false, error: 'El título del contenido es obligatorio.' },
        { status: 400 }
      );
    }

    const subtitle_en = body.subtitle_en || body.subtitle_es || '';
    const subtitle_es = body.subtitle_es || body.subtitle_en || '';
    const description_en = body.description_en || body.description_es || '';
    const description_es = body.description_es || body.description_en || '';
    const media_url = body.media_url || '';
    const media_type = body.media_type || (media_url ? 'image' : 'none');
    const badge_en = body.badge_en || body.badge_es || '';
    const badge_es = body.badge_es || body.badge_en || '';
    const cta_text_en = body.cta_text_en || body.cta_text_es || '';
    const cta_text_es = body.cta_text_es || body.cta_text_en || '';
    const cta_link = body.cta_link || '';
    const meta_json = body.meta_json || {};
    const display_order = Number(body.display_order || 10);
    // Por requerimiento del usuario: cada registro nuevo sale como 'active' por defecto
    const status = body.status === 'inactive' ? 'inactive' : 'active';
    const changed_by = body.changed_by || 'Admin NARA';
    const item_key = body.item_key || `custom_${section}_${Date.now()}`;

    const insertRes = await db.query(
      `INSERT INTO cms_items (
        item_key, page, section, content_type,
        title_en, title_es, subtitle_en, subtitle_es,
        description_en, description_es, media_url, media_type,
        badge_en, badge_es, cta_text_en, cta_text_es, cta_link,
        meta_json, display_order, status, created_by, updated_by
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10, $11, $12,
        $13, $14, $15, $16, $17,
        $18::jsonb, $19, $20, $21, $21
      ) RETURNING *`,
      [
        item_key,
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
        changed_by,
      ]
    );

    const newItem = insertRes.rows[0];

    // Registrar en el historial de trazabilidad
    await db.query(
      `INSERT INTO cms_audit_logs (
        cms_item_id, item_title, page, section, content_type,
        action, previous_status, new_status, changed_by, details, snapshot_json
      ) VALUES ($1, $2, $3, $4, $5, 'CREATED', NULL, $6, $7, $8, $9::jsonb)`,
      [
        newItem.id,
        newItem.title_es || newItem.title_en,
        newItem.page,
        newItem.section,
        newItem.content_type,
        newItem.status,
        changed_by,
        `Nuevo elemento creado en sección "${newItem.section}" con estado inicial ACTIVO.`,
        JSON.stringify(newItem),
      ]
    );

    return NextResponse.json({
      ok: true,
      item: newItem,
    });
  } catch (error: unknown) {
    console.error('Error POST /api/cms:', error);
    const errMsg = error instanceof Error ? error.message : 'Error al guardar en PostgreSQL';
    return NextResponse.json({ ok: false, error: errMsg }, { status: 500 });
  }
}

