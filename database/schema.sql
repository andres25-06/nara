-- ============================================================================
-- LOVE HEALS · NARA — PostgreSQL Database Schema (Database: nara)
-- ============================================================================

-- 1. Tabla de Usuarios Administradores
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla Principal de Contenidos CMS (Textos, Imágenes, Videos, Tarjetas, Círculos)
-- Todo registro nuevo tiene por defecto status = 'active'
CREATE TABLE IF NOT EXISTS cms_items (
    id SERIAL PRIMARY KEY,
    item_key VARCHAR(120) UNIQUE,
    page VARCHAR(50) NOT NULL DEFAULT 'home',
    section VARCHAR(80) NOT NULL,
    content_type VARCHAR(40) NOT NULL DEFAULT 'card', -- 'text' | 'image' | 'video' | 'pillar' | 'stage' | 'circle'
    title_en TEXT NOT NULL,
    title_es TEXT NOT NULL,
    subtitle_en TEXT DEFAULT '',
    subtitle_es TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    description_es TEXT DEFAULT '',
    media_url TEXT DEFAULT '',
    media_type VARCHAR(30) DEFAULT 'none', -- 'none' | 'image' | 'video'
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

-- 3. Tabla de Trazabilidad e Historial de Cambios (Audit Logs)
CREATE TABLE IF NOT EXISTS cms_audit_logs (
    id SERIAL PRIMARY KEY,
    cms_item_id INT NULL,
    item_title VARCHAR(255) NOT NULL,
    page VARCHAR(50) NOT NULL DEFAULT 'home',
    section VARCHAR(80) NOT NULL DEFAULT 'general',
    content_type VARCHAR(40) NOT NULL DEFAULT 'card',
    action VARCHAR(40) NOT NULL, -- 'CREATED' | 'UPDATED' | 'ACTIVATED' | 'DEACTIVATED' | 'DELETED'
    previous_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_by VARCHAR(120) DEFAULT 'Admin NARA',
    details TEXT DEFAULT '',
    snapshot_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_cms_items_page_section ON cms_items(page, section);
CREATE INDEX IF NOT EXISTS idx_cms_items_status ON cms_items(status);
CREATE INDEX IF NOT EXISTS idx_cms_audit_logs_created_at ON cms_audit_logs(created_at DESC);

