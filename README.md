# Love Heals · NARA — Plataforma Oncológica y Acompañamiento Emocional

Plataforma web médica y psicológica bilingüe (Español / Inglés) con panel administrativo independiente (`/admin`), arquitectura moderna en Next.js 15, React 19 y base de datos relacional PostgreSQL con auditoría y trazabilidad en tiempo real.

---

## 🚀 Tecnologías

- **Framework**: Next.js 15 (App Router) + React 19
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS + Google Fonts (Playfair Display / Plus Jakarta Sans)
- **Base de Datos**: PostgreSQL 18 (`pg` pool con singleton y lock de migración)
- **Internacionalización**: i18next + react-i18next (Base por defecto en Inglés con botón instantáneo `ES | EN`)
- **Voz y Accesibilidad**: Widget interactivo con Web Speech API y sintetizador de voz empático.

---

## 🗄️ Base de Datos PostgreSQL (`nara`)

El repositorio incluye la copia completa y el esquema en la carpeta [`database/`](./database/):

1. **`database/nara_backup.sql`**: Dump completo de la base de datos con tablas, secuencias, usuarios administradores y los 19 registros iniciales del CMS (Inicio, Nosotros, Pacientes, Cuidadores y Footer).
2. **`database/schema.sql`**: Definición DDL de las tablas:
   - `admin_users`: Usuarios administradores con roles (`superadmin`, `admin`).
   - `cms_items`: Textos, imágenes, videos, etapas, pilares y bloques del pie de página.
   - `cms_audit_logs`: Registro histórico y trazabilidad de cada acción (`CREATED`, `UPDATED`, `ACTIVATED`, `DEACTIVATED`, `DELETED`).

### Restaurar la base de datos en PostgreSQL / pgAdmin:
```bash
# Crear la base de datos 'nara' en PostgreSQL
psql -U postgres -c "CREATE DATABASE nara;"

# Restaurar la copia de seguridad
psql -U postgres -d nara -f database/nara_backup.sql
```

---

## ⚙️ Configuración del Entorno

Crea un archivo `.env.local` en la raíz del proyecto (toma como referencia [`.env.example`](./.env.example)):

```env
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=nara
DB_USERNAME=postgres
DB_PASSWORD=123
```

---

## 📦 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre tu navegador en:
- **Página Pública**: [http://localhost:3000](http://localhost:3000)
- **Panel Administrativo**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔐 Credenciales del Panel Administrativo

- **Usuario**: `admin@nara.org` (o `postgres`)
- **Contraseña**: `123`
- **Rol**: `superadmin`

---

## 📁 Estructura del Proyecto

```
├── database/               # Esquema DDL y backup completo PostgreSQL (nara_backup.sql)
├── public/                 # Recursos estáticos
├── src/
│   ├── app/
│   │   ├── admin/          # Panel administrativo independiente (CMS por páginas y secciones)
│   │   ├── api/
│   │   │   ├── auth/login/ # Autenticación de administradores en PostgreSQL
│   │   │   └── cms/        # API REST para CRUD y trazabilidad de contenidos
│   │   ├── cuidadores/     # Página de acompañamiento a familiares y cuidadores
│   │   ├── paciente/       # Página para pacientes oncológicos
│   │   ├── pilares/        # Nosotros y los 4 pilares fundamentales
│   │   ├── layout.tsx      # Layout raíz
│   │   └── page.tsx        # Portada principal con diseño armónico
│   ├── components/
│   │   ├── layout/         # Navbar, Footer dinámico, Shell de cliente y Widget de Voz
│   │   └── ui/             # Componentes de interfaz
│   ├── context/            # NaraContext (sesión, modales, widgets)
│   ├── i18n/               # Configuración y diccionarios bilingües (ES / EN)
│   └── lib/                # Conexión pg Pool, inicialización y seed data
```
