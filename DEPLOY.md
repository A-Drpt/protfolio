# 🚀 Guide de déploiement sur Render

Ce guide vous accompagne pour déployer votre portfolio Symfony + React sur Render.

---

## 📋 Prérequis

1. **Compte Render** : Créez un compte sur [render.com](https://render.com)
2. **Repository GitHub** : Votre code doit être sur GitHub (public ou privé)
3. **Git configuré** : Assurez-vous que tous vos fichiers sont commités

---

## 🔧 Étape 1 : Préparer le repository

### 1.1 Vérifier les fichiers de déploiement

Les fichiers suivants ont été créés automatiquement :
- ✅ `Dockerfile` - Image Docker pour production
- ✅ `render.yaml` - Configuration Render (infrastructure as code)
- ✅ `.dockerignore` - Exclusions pour le build Docker
- ✅ `docker/nginx/default.conf` - Configuration nginx
- ✅ `docker/supervisor/supervisord.conf` - Gestion des processus

### 1.2 Créer le fichier .env (si absent)

Créez un fichier `.env` à la racine avec :

```env
APP_ENV=dev
APP_SECRET=changeme
DATABASE_URL="postgresql://user:pass@127.0.0.1:5432/portfolio?serverVersion=16&charset=utf8"
```

**Important** : Ne committez JAMAIS le fichier `.env` avec des vrais secrets.

### 1.3 Ajouter .gitkeep dans public/uploads

```bash
mkdir -p public/uploads/projects
touch public/uploads/.gitkeep
```

### 1.4 Committer et pusher

```bash
git add .
git commit -m "chore: add Render deployment files"
git push origin main
```

---

## 🎯 Étape 2 : Déployer sur Render

### 2.1 Utiliser le Blueprint (recommandé - automatique)

1. Connectez-vous sur [render.com](https://dashboard.render.com)
2. Cliquez sur **"New +"** → **"Blueprint"**
3. Connectez votre repository GitHub
4. Render détecte automatiquement le fichier `render.yaml`
5. Cliquez sur **"Apply"**

Render créera automatiquement :
- ✅ Le service web (Symfony)
- ✅ La base de données PostgreSQL
- ✅ Le disque persistant pour `/public/uploads`
- ✅ Les variables d'environnement

### 2.2 OU Créer manuellement (alternatif)

Si vous préférez configurer manuellement :

#### A. Créer la base de données

1. **New +** → **PostgreSQL**
2. Nom : `portfolio-db`
3. Database : `portfolio`
4. User : `portfolio_user`
5. Region : `Frankfurt` (ou proche de vous)
6. Plan : **Starter** (gratuit)
7. Cliquez **Create Database**

#### B. Créer le service web

1. **New +** → **Web Service**
2. Connectez votre repo GitHub
3. Configuration :
   - **Name** : `portfolio-symfony`
   - **Region** : `Frankfurt` (même que la DB)
   - **Branch** : `main`
   - **Runtime** : `Docker`
   - **Dockerfile Path** : `./Dockerfile`
   - **Plan** : `Starter` ($7/mois, ou Free avec limitations)

4. **Variables d'environnement** (onglet Environment) :
   ```
   APP_ENV=prod
   APP_SECRET=<générer avec: php bin/console secrets:generate-keys>
   DATABASE_URL=<copier depuis votre DB Render: Internal Connection String>
   ```

5. **Disque persistant** (onglet Disks) :
   - Cliquez **Add Disk**
   - Name : `uploads`
   - Mount Path : `/app/public/uploads`
   - Size : `1 GB`

6. Cliquez **Create Web Service**

---

## ⚙️ Étape 3 : Configuration post-déploiement

### 3.1 Exécuter les migrations

Une fois le service déployé, ouvrez le **Shell** depuis le dashboard Render :

```bash
php bin/console doctrine:migrations:migrate --no-interaction
```

### 3.2 Créer un compte admin

Dans le Shell Render :

```bash
php bin/console doctrine:fixtures:load --no-interaction
```

Ou créez manuellement un utilisateur admin :

```bash
php bin/console security:hash-password
# Entrez votre mot de passe, copiez le hash

# Puis insérez dans la DB via le shell PostgreSQL
psql $DATABASE_URL -c "INSERT INTO admin_user (username, password) VALUES ('admin', 'VOTRE_HASH_ICI');"
```

### 3.3 Vérifier l'upload des images

Testez l'upload d'images depuis l'admin. Les fichiers doivent persister dans `/app/public/uploads` (disque Render).

---

## 🔒 Étape 4 : Sécurité

### 4.1 Générer un vrai APP_SECRET

Localement :
```bash
php -r "echo bin2hex(random_bytes(16)) . PHP_EOL;"
```

Copiez le résultat et remplacez dans les **Environment Variables** sur Render.

### 4.2 Configurer CORS (si vous avez un frontend séparé)

Dans `render.yaml` ou variables d'environnement :
```
CORS_ALLOW_ORIGIN=^https://votre-domaine\.com$
```

### 4.3 HTTPS automatique

Render active automatiquement HTTPS avec Let's Encrypt. Aucune config nécessaire.

---

## 🌐 Étape 5 : Domaine personnalisé (optionnel)

1. Dans le dashboard Render de votre service web
2. Onglet **Settings** → **Custom Domains**
3. Cliquez **Add Custom Domain**
4. Entrez votre domaine (ex: `portfolio.votredomaine.com`)
5. Ajoutez l'enregistrement DNS chez votre registrar :
   ```
   Type: CNAME
   Name: portfolio
   Value: <votre-service>.onrender.com
   ```
6. Attendez la propagation DNS (~10 min à 1h)
7. Render provisionne automatiquement le certificat SSL

---

## 🔄 Déploiement continu

### Auto-deploy sur push

Render redéploie automatiquement à chaque push sur `main` :

```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
```

Le build démarre automatiquement et met à jour votre site en ~5 minutes.

### Désactiver l'auto-deploy

Dans **Settings** → **Build & Deploy** → Décochez **Auto-Deploy**.

---

## 📊 Monitoring et logs

### Voir les logs en temps réel

Dans le dashboard Render :
- Onglet **Logs** pour voir les logs nginx, PHP-FPM, et Symfony
- Utilisez la recherche pour filtrer les erreurs

### Métriques

- **Metrics** : CPU, RAM, requêtes HTTP
- **Events** : Historique des déploiements

### Alertes (payant)

Configurez des alertes email/Slack dans **Settings** → **Notifications**.

---

## 🐛 Dépannage

### Le build échoue

1. Vérifiez les logs du build dans l'onglet **Events**
2. Erreurs fréquentes :
   - Dépendances Node manquantes → vérifier `package.json`
   - Composer bloqué → vérifier `composer.lock` à jour
   - Migrations en erreur → exécuter manuellement dans le Shell

### L'application ne démarre pas

1. Ouvrez le **Shell** et vérifiez :
   ```bash
   php bin/console cache:clear
   php bin/console debug:router
   ```

2. Vérifiez les permissions :
   ```bash
   ls -la var/
   ls -la public/uploads/
   ```

### Les uploads ne fonctionnent pas

1. Vérifiez que le disque est monté :
   ```bash
   df -h | grep uploads
   ```

2. Permissions :
   ```bash
   chown -R www-data:www-data /app/public/uploads
   chmod -R 775 /app/public/uploads
   ```

### Base de données ne se connecte pas

1. Vérifiez la variable `DATABASE_URL` :
   ```bash
   echo $DATABASE_URL
   ```

2. Testez la connexion :
   ```bash
   php bin/console doctrine:query:sql "SELECT 1"
   ```

---

## 💰 Coûts estimés

| Service | Plan | Prix |
|---------|------|------|
| Web Service | Starter | $7/mois |
| PostgreSQL | Starter | Gratuit |
| Disque 1GB | - | Gratuit |
| **Total** | | **~$7/mois** |

**Alternative gratuite** : Plan Free (avec limitations : sleep après inactivité, moins de RAM).

---

## 🎉 Terminé !

Votre portfolio est maintenant en ligne ! 🚀

**URL de votre site** : `https://portfolio-symfony.onrender.com` (ou votre domaine custom)

**Prochaines étapes** :
- ✅ Configurez un domaine personnalisé
- ✅ Ajoutez du contenu via l'admin
- ✅ Configurez Google Analytics (optionnel)
- ✅ Ajoutez un sitemap pour le SEO

---

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Symfony Deployment](https://symfony.com/doc/current/deployment.html)
- [Render Community Forum](https://community.render.com)

Besoin d'aide ? Consultez les logs ou ouvrez un ticket support Render.
