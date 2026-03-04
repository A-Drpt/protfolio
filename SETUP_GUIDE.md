# Portfolio Symfony - Setup Guide

## Project Recovery Complete ✅

Your entire project has been reconstructed from the conversation history. All React components, Symfony controllers, entities, templates, and configuration files have been restored.

## Quick Start

### Prerequisites
- PHP 8.2+
- Node.js (npm)
- MySQL running on port 8889 (MAMP)

### 1. Install Dependencies
```bash
# Dependencies already installed, but to reinstall:
composer install
npm install
```

### 2. Build Assets
```bash
npm run build
```

### 3. Create Database & Run Migrations
```bash
# Create database
php bin/console doctrine:database:create --if-not-exists

# Run migrations
php bin/console doctrine:migrations:migrate
```

### 4. Load Fixtures (with test data)
```bash
php bin/console doctrine:fixtures:load --no-interaction
```

### 5. Generate JWT Keys
```bash
mkdir -p config/jwt
php bin/console lexik:jwt:generate-keypair --skip-if-exists
```

### 6. Start Dev Server
```bash
symfony server:start
# Or: php -S localhost:8000 -t public
```

## Admin Access

**Email:** `admin@portfolio.local`  
**Password:** `admin123`

## Project Structure

```
├── src/
│   ├── Controller/              # Symfony controllers
│   ├── Entity/                  # Doctrine entities
│   ├── Repository/              # Doctrine repositories
│   └── DataFixtures/            # Test data
├── assets/
│   ├── js/
│   │   ├── components/          # React components
│   │   ├── api/                 # API client
│   │   ├── admin.jsx            # React admin entry
│   │   └── app.js               # Public site entry
│   └── styles/
│       └── app.css              # Dark theme styles
├── templates/                   # Twig templates
├── config/                      # Configuration files
├── migrations/                  # Database migrations
└── public/build/                # Built assets (Webpack)
```

## Key Features Restored

✅ **React Admin Dashboard**
- Create, read, update, delete Projects
- Manage Skills (hard & soft types)
- Manage Experiences
- Success/error notifications with auto-dismiss
- Image upload with preview

✅ **API Endpoints**
- JWT authentication with refresh tokens
- RESTful API with proper security
- FormData support for file uploads

✅ **Dark Theme**
- Modern dark UI with Bootstrap 5
- Admin dashboard with responsive layout
- Project showcase pages

✅ **Database**
- MySQL with Doctrine ORM
- User authentication system
- Fixtures for test data

## Development Commands

```bash
# Watch mode for assets
npm run watch

# Build for production
npm run build

# Run tests
./bin/phpunit

# Load fixtures
php bin/console doctrine:fixtures:load --no-interaction

# Create migration
php bin/console make:migration

# Run migrations
php bin/console doctrine:migrations:migrate
```

## Troubleshooting

### MySQL Connection Refused
- Make sure MAMP is running
- Verify DATABASE_URL in .env points to correct port (8889)

### Webpack Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`

### JWT Keys Not Found
```bash
mkdir -p config/jwt
php bin/console lexik:jwt:generate-keypair --skip-if-exists
```

### Doctrine Errors
- Clear cache: `php bin/console cache:clear`
- Verify database exists: `php bin/console doctrine:database:create --if-not-exists`

## Important Notes

- **.env** contains sensitive data - never commit to git
- **config/jwt/** contains private keys - never commit to git
- Database credentials in .env (MAMP: root/root on port 8889)
- All assets are built to `public/build/` - add to .gitignore

## Next Steps

1. Start MySQL (MAMP)
2. Run: `php bin/console doctrine:database:create --if-not-exists`
3. Run: `php bin/console doctrine:migrations:migrate`
4. Run: `php bin/console doctrine:fixtures:load --no-interaction`
5. Run: `symfony server:start`
6. Visit: `http://localhost:8000/admin`
7. Login with `admin@portfolio.local` / `admin123`

## Recovery Summary

This project was completely restored after accidental deletion during GitHub upload. All files were recreated from conversation history, including:

- 14 React components for the admin dashboard
- 7 Symfony controllers (Main, Admin, Login, Auth, Project, Skill, Experience APIs)
- 5 Doctrine entities (User, Project, Skill, Experience, RefreshToken)
- Complete Twig templates for all pages
- Database migration and fixtures
- Webpack configuration with React support
- Security configuration with JWT authentication
- All CSS/SCSS styling with dark theme

**Status:** ✅ Ready to run! Start MySQL and follow "Quick Start" above.
