# 🛠️ Commandes Utiles

## 🚀 Démarrer le Système

### Backend Laravel
```bash
cd backend

# Installer les dépendances
composer install

# Configurer l'environnement
cp .env.example .env
php artisan key:generate

# Base de données
php artisan migrate
php artisan db:seed

# Lancer le serveur
php artisan serve --port=8000

# En développement avec logs temps réel
php artisan serve --port=8000
# Dans un autre terminal:
tail -f backend/storage/logs/laravel.log

# Si vous lancez une queue
php artisan queue:listen
```

### Frontend Vue 3
```bash
cd frontend-vue

# Installer les dépendances
npm install
# ou
pnpm install

# Démarrer le dev server
npm run dev
# ou
pnpm dev

# Builder pour la production
npm run build
# ou
pnpm build
```

---

## 🔍 Debugging

### Vérifier la Syntaxe PHP
```bash
cd backend

# Vérifier un fichier
php -l app/Http/Controllers/ReclamationController.php

# Vérifier tous les fichiers PHP
find app -name "*.php" -exec php -l {} \;

# Tester le bootstrap
php -r "require_once 'bootstrap/app.php'; echo 'OK';"
```

### Vérifier les Routes
```bash
cd backend

# Lister toutes les routes
php artisan route:list

# Lister seulement les routes `/api/v1/`
php artisan route:list --path=api/v1

# Lister seulement les routes pour les réclamations
php artisan route:list --path=complaints
```

### Vérifier les Migrations
```bash
cd backend

# Voir l'état des migrations
php artisan migrate:status

# Faire une migration spécifique
php artisan migrate --path=database/migrations/2026_04_30_231114_create_reclamations_table.php

# Rollback dernière migration
php artisan migrate:rollback

# Rollback tout
php artisan migrate:reset
php artisan migrate
```

### Tester les API Endpoints
```bash
# Authentification
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"agent1@immogestion.com","password":"Agent@2024!"}'

# Récupérer le token et l'utiliser
TOKEN="votre_token_ici"

# Dashboard Stats
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/dashboard/stats

# Lister les réclamations
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/complaints

# Détail d'une réclamation
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/complaints/1

# Mettre à jour une réclamation
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"statut":"en_cours","agent_response":"Message"}' \
  http://localhost:8000/api/v1/complaints/1
```

---

## 🗄️ Base de Données

### MySQL Commands
```bash
# Se connecter à MySQL
mysql -u root -p

# Voir la structure de la table
USE laravel;
DESCRIBE reclamations;

# Voir les réclamations
SELECT id, client_id, agent_id, statut, created_at, updated_at FROM reclamations;

# Voir les réservations d'un agent
SELECT id, client_id, agent_id, statut FROM reservations WHERE agent_id = 2;

# Mettre à jour manuellement (pour tester)
UPDATE reclamations SET statut = 'en_cours' WHERE id = 1;
```

---

## 📦 Gestion des Dépendances

### Backend
```bash
cd backend

# Mettre à jour Composer
composer update

# Installer un package
composer require vendor/package

# Supprimer un package
composer remove vendor/package

# Vérifier les problèmes
composer diagnose
```

### Frontend
```bash
cd frontend-vue

# Mettre à jour npm
npm update
# ou
pnpm update

# Installer un package
npm install package-name
# ou
pnpm add package-name

# Mettre à jour un package
npm install package-name@latest
```

---

## 🧹 Nettoyage & Cache

### Backend
```bash
cd backend

# Nettoyer le cache de config
php artisan config:clear
php artisan config:cache

# Nettoyer le cache de routes
php artisan route:clear
php artisan route:cache

# Nettoyer le cache de views
php artisan view:clear
php artisan view:cache

# Nettoyer tous les caches
php artisan cache:clear
php artisan optimize:clear

# Nettoyer les fichiers temporaires
php artisan tinker
# À l'intérieur de tinker:
# >>> Cache::flush()
# >>> Artisan::call('queue:failed')
```

### Frontend
```bash
cd frontend-vue

# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install

# Nettoyer la build
rm -rf dist
npm run build

# Vider le cache npm
npm cache clean --force
```

---

## 📝 Logs & Debugging

### Voir les Logs Backend
```bash
cd backend

# Logs temps réel
tail -f storage/logs/laravel.log

# Voir seulement les erreurs
grep -i error storage/logs/laravel.log

# Voir les n dernières lignes
tail -n 50 storage/logs/laravel.log

# Nettoyer les logs
rm storage/logs/laravel.log
```

### Console Vue (Frontend)
```javascript
// Ouvrir la console browser: F12

// Debug les variables
console.log(complaint.value)
console.log(newStatus.value)

// Debug les appels API
// Dans le navigateur, l'onglet Network montre les requêtes HTTP
```

---

## 🔐 Authentification & Sessions

### Générer un Token (CLI)
```bash
cd backend

# Dans Tinker
php artisan tinker

# À l'intérieur de tinker:
$user = App\Models\User::where('email', 'agent1@immogestion.com')->first();
$token = $user->createToken('test')->plainTextToken;
echo $token;
```

### Nettoyer les Tokens
```bash
cd backend

# Supprimer tous les tokens
php artisan tinker
$token = App\Models\PersonalAccessToken::truncate();

# Déconnecter tous les utilisateurs
DB::table('personal_access_tokens')->delete();
```

---

## 🚨 Troubleshooting Rapide

### Erreur "Champ 'status' inconnu"
```bash
# Solution: Utiliser 'statut' au lieu de 'status'
# Vérifier: RealEstateController ligne 46-50
# Voir: where('statut', 'en_attente') ✅
```

### Erreur "Accès refusé" (403)
```bash
# Normal si:
# - Agent n'est pas assigné à la réclamation
# - Client n'a pas créé la réclamation
# - Utilisateur n'a pas le bon rôle

# Vérifier dans ReclamationController les vérifications d'autorisation
```

### Erreur "Colonne 'agent_id' inconnu"
```bash
# Solution: Vérifier que les migrations ont été exécutées
php artisan migrate:status
php artisan migrate
```

### Erreur 500 Générique
```bash
# 1. Vérifier les logs
tail -f backend/storage/logs/laravel.log

# 2. Vérifier la syntaxe PHP
php -l backend/app/Http/Controllers/ReclamationController.php

# 3. Tester en local avec une requête simple
php artisan tinker
# Essayer d'accéder à Reclamation::first()
```

### Frontend ne se connecte pas à l'API
```bash
# Vérifier:
# 1. Le port 8000 est accessible
# 2. L'URL VITE_API_BASE_URL est correcte dans .env
# 3. CORS est configuré correctement

# Dans .env frontend-vue:
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## ⚡ One-Liners Utiles

```bash
# Vérifier les fichiers modifiés (Git)
git status

# Voir les changements
git diff

# Voir les commits récents
git log --oneline -10

# Voir qui a modifié une ligne
git blame app/Http/Controllers/ReclamationController.php

# Stash les changements (les mettre de côté)
git stash

# Récupérer les changements
git stash pop

# Créer une nouvelle branche
git checkout -b feature/nouvelle-feature

# Fusionner deux branches
git merge feature/autre-branche

# Annuler les changements d'un fichier
git checkout -- app/Http/Controllers/ReclamationController.php
```

---

## 📊 Performance

### Vérifier la Performance
```bash
# Laravel Debugbar (local seulement)
# Ajouter à .env:
DEBUGBAR_ENABLED=true

# Vérifier les requêtes SQL
php artisan tinker
# À l'intérieur:
>>> DB::enableQueryLog();
>>> App\Models\Reclamation::with('client', 'agent')->get();
>>> DB::getQueryLog();

# Vérifier le temps de réponse de l'API
curl -w "@curl-format.txt" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/dashboard/stats
```

---

## 🎯 Checklists Rapides

### Avant de Committer
- [ ] Pas de `console.log()` en production
- [ ] Pas de `dd()` ou `dump()` en production  
- [ ] Pas de code commenté
- [ ] Tests passent
- [ ] Pas d'erreurs TypeScript
- [ ] Pas d'erreurs PHP lint

### Avant de Déployer
- [ ] Migrations exécutées
- [ ] Seeds lancées (si nécessaire)
- [ ] `.env` configuré
- [ ] Cache vidé
- [ ] Logs consultés pour erreurs
- [ ] Tests manuels OK
- [ ] Backup de la BD effectuée
