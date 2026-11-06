import { NextRequest, NextResponse } from 'next/server';
import { ensureDatabaseInitialized, getPool } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseInitialized();
    const db = getPool();
    const body = await req.json();
    const identifier = (body.email || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    if (!identifier || !password) {
      return NextResponse.json(
        { ok: false, error: 'Por favor ingresa tu correo/usuario y contraseña.' },
        { status: 400 }
      );
    }

    const result = await db.query(
      `SELECT id, email, name, role, status
       FROM admin_users
       WHERE (LOWER(email) = $1 OR LOWER(name) = $1)
         AND password = $2
         AND status = 'active'
       LIMIT 1`,
      [identifier, password]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Credenciales inválidas. Prueba con admin@nara.org / 123 o postgres / 123',
        },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    console.error('Error en /api/auth/login:', error);
    const errMsg = error instanceof Error ? error.message : 'Error de conexión a PostgreSQL';
    return NextResponse.json(
      { ok: false, error: `Error al conectar con PostgreSQL (nara): ${errMsg}` },
      { status: 500 }
    );
  }
}

