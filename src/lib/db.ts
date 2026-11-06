import { Pool, Client } from 'pg';
import { INITIAL_CMS_ITEMS } from './seedData';

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_DATABASE || 'nara',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '123',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

declare global {
  // eslint-disable-next-line no-var
  var __naraPgPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __naraDbSeedVersion: number | undefined;
  // eslint-disable-next-line no-var
  var __naraDbInitPromise: Promise<void> | undefined;
}

const CURRENT_SEED_VERSION = 2;

export function getPool(): Pool {
  if (!globalThis.__naraPgPool) {
    globalThis.__naraPgPool = new Pool(DB_CONFIG);
  }
  return globalThis.__naraPgPool;
}

/**
 * Ensures the PostgreSQL database `nara` exists, creates tables if missing,
 * and seeds initial CMS records (Inicio, Nosotros, Pacientes, Cuidadores, Footer)
 * ONCE per server lifecycle using a global lock.
 */
export async function ensureDatabaseInitialized(): Promise<void> {
  if (globalThis.__naraDbSeedVersion === CURRENT_SEED_VERSION) return;
  if (globalThis.__naraDbInitPromise) {
    return globalThis.__naraDbInitPromise;
  }

  globalThis.__naraDbInitPromise = (async () => {
    try {
      const db = getPool();

      try {
        await db.query('SELECT 1');
      } catch (err: unknown) {
        const pgErr = err as { code?: string };
        if (pgErr?.code === '3D000') {
          const adminClient = new Client({
            ...DB_CONFIG,
            database: 'postgres',
          });
          await adminClient.connect();
          await adminClient.query(`CREATE DATABASE ${DB_CONFIG.database}`);
          await adminClient.end();
        }
      }

      // Create Tables safely
      await db.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'admin',
          status VARCHAR(20) NOT NULL DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS cms_items (
          id SERIAL PRIMARY KEY,
          item_key VARCHAR(120) UNIQUE,
          page VARCHAR(50) NOT NULL DEFAULT 'home',
          section VARCHAR(80) NOT NULL,
          content_type VARCHAR(40) NOT NULL DEFAULT 'card',
          title_en TEXT NOT NULL,
          title_es TEXT NOT NULL,
          subtitle_en TEXT DEFAULT '',
          subtitle_es TEXT DEFAULT '',
          description_en TEXT DEFAULT '',
          description_es TEXT DEFAULT '',
          media_url TEXT DEFAULT '',
          media_type VARCHAR(30) DEFAULT 'none',
          badge_en VARCHAR(120) DEFAULT '',
          badge_es VARCHAR(120) DEFAULT '',
          cta_text_en VARCHAR(120) DEFAULT '',
          cta_text_es VARCHAR(120) DEFAULT '',
          cta_link TEXT DEFAULT '',
          meta_json JSONB DEFAULT '{}'::jsonb,
          display_order INT DEFAULT 0,
          status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
          created_by VARCHAR(120) DEFAULT 'Admin NARA',
          updated_by VARCHAR(120) DEFAULT 'Admin NARA',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS cms_audit_logs (
          id SERIAL PRIMARY KEY,
          cms_item_id INT NULL,
          item_title VARCHAR(255) NOT NULL,
          page VARCHAR(50) NOT NULL DEFAULT 'home',
          section VARCHAR(80) NOT NULL DEFAULT 'general',
          content_type VARCHAR(40) NOT NULL DEFAULT 'card',
          action VARCHAR(40) NOT NULL,
          previous_status VARCHAR(20),
          new_status VARCHAR(20),
          changed_by VARCHAR(120) DEFAULT 'Admin NARA',
          details TEXT DEFAULT '',
          snapshot_json JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_cms_items_page_section ON cms_items(page, section);
        CREATE INDEX IF NOT EXISTS idx_cms_items_status ON cms_items(status);
        CREATE INDEX IF NOT EXISTS idx_cms_audit_logs_created_at ON cms_audit_logs(created_at DESC);
      `);

      // Seed default Admin Users
      await db.query(
        `INSERT INTO admin_users (email, name, password, role, status)
         VALUES 
           ('admin@nara.org', 'Administrador NARA', '123', 'superadmin', 'active'),
           ('postgres', 'Eider Admin (PostgreSQL)', '123', 'superadmin', 'active')
         ON CONFLICT (email) DO NOTHING`
      );

      // Ensure all INITIAL_CMS_ITEMS (including Inicio, Nosotros, Paciente, Cuidadores, Footer) exist
      for (const item of INITIAL_CMS_ITEMS) {
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
            $18::jsonb, $19, $20, 'Sistema Inicial', 'Sistema Inicial'
          )
          ON CONFLICT (item_key) DO NOTHING
          RETURNING id`,
          [
            item.item_key,
            item.page,
            item.section,
            item.content_type,
            item.title_en,
            item.title_es,
            item.subtitle_en || '',
            item.subtitle_es || '',
            item.description_en,
            item.description_es,
            item.media_url || '',
            item.media_type,
            item.badge_en || '',
            item.badge_es || '',
            item.cta_text_en || '',
            item.cta_text_es || '',
            item.cta_link || '',
            JSON.stringify(item.meta_json || {}),
            item.display_order,
            item.status || 'active',
          ]
        );

        if (insertRes.rows[0]?.id) {
          await db.query(
            `INSERT INTO cms_audit_logs (
              cms_item_id, item_title, page, section, content_type,
              action, previous_status, new_status, changed_by, details, snapshot_json
            ) VALUES ($1, $2, $3, $4, $5, 'CREATED', NULL, 'active', 'Sistema Inicial', $6, $7::jsonb)`,
            [
              insertRes.rows[0].id,
              item.title_es,
              item.page,
              item.section,
              item.content_type,
              `Registro inicial (${item.page} → ${item.section}) cargado en PostgreSQL (nara).`,
              JSON.stringify(item),
            ]
          );
        }
      }

      globalThis.__naraDbSeedVersion = CURRENT_SEED_VERSION;
    } finally {
      globalThis.__naraDbInitPromise = undefined;
    }
  })();

  return globalThis.__naraDbInitPromise;
}
