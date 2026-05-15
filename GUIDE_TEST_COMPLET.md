# 🧪 Guide de Test Complet - Système Réclamations

## 👥 Comptes de Test Disponibles

Les comptes sont définis dans `backend/database/seeders/UserSeeder.php`

### **Admin**
| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `mlamaranapalaga21@gmail.com` | `Admin@2024!` | Admin |
| `oumouratoubarry52@gmail.com` | `Admin@2024!` | Admin |

### **Agent**
| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `agent1@immogestion.com` | `Agent@2024!` | Agent |

### **Client**
| Email | Mot de passe | Rôle | Client ID |
|-------|--------------|------|-----------|
| `client@immogestion.com` | `Client@2024!` | Client | 1 |

---

## 🚀 Étapes de Configuration

### **1. Initialiser la Base de Données**
```bash
cd backend

# Lancer les migrations
php artisan migrate

# Charger les seeders
php artisan db:seed
```

### **2. Démarrer le Serveur Laravel**
```bash
cd backend
php artisan serve --port=8000
```

### **3. Démarrer le Frontend Vue (optionnel)**
```bash
cd frontend-vue
npm run dev
```

---

## ✅ Scénario de Test Complet

### **Phase 1: Vérifier le Dashboard Agent**

1. **Se connecter comme Agent**
   - URL: `http://localhost:8000/login` (ou via l'app)
   - Email: `agent1@immogestion.com`
   - Mot de passe: `Agent@2024!`

2. **Accéder au Dashboard**
   - URL: `/agent/dashboard`
   - Vérifier que les stats s'affichent:
     - ✅ Nombre total de propriétés
     - ✅ Nombre total de réservations
     - ✅ Nombre de réservations en attente
     - ✅ Taux d'occupation
   - **Erreur attendue**: Aucune (la correction devrait résoudre l'erreur 500)

### **Phase 2: Agent Traite une Réclamation**

1. **Accéder à la liste des réclamations**
   - URL: `/agent/reclamations`
   - Vérifier qu'une ou plusieurs réclamations sont affichées

2. **Cliquer sur une réclamation**
   - URL: `/agent/reclamations/3` (ou un autre ID)
   - Attendre le chargement de la page
   - **Erreur attendue**: Aucune (les détails devraient charger)

3. **Vérifier l'interface de traitement**
   - ✅ Voir les détails du client
   - ✅ Voir la réservation associée
   - ✅ Voir l'objet de la réclamation
   - ✅ Voir 3 boutons: **"Traiter | Résolu | Annuler"** (plus "Ouverte")
   - ✅ Voir un textarea pour le message de réponse

4. **Traiter la réclamation**
   - Cliquer sur le bouton "Traiter"
   - Le bouton "Traiter" devrait être surligné
   - Écrire un message de réponse: `"Merci pour votre signalement, nous prenons en charge votre problème."`
   - Cliquer "Enregistrer la réponse"
   - **Résultat attendu**: Message "Réclamation mise à jour avec succès !"

5. **Vérifier la mise à jour**
   - La page devrait afficher le nouveau statut: "Traiter"
   - Le récapitulatif à droite devrait montrer la réponse

### **Phase 3: Client Voit la Mise à Jour**

1. **Se connecter comme Client**
   - URL: `http://localhost:8000/login`
   - Email: `client@immogestion.com`
   - Mot de passe: `Client@2024!`

2. **Accéder à la liste des réclamations**
   - URL: `/client/reclamations`
   - Vérifier que la page affiche les compteurs:
     - ✅ "En cours: 1" (la réclamation que l'agent a mise à jour)
     - ✅ "Résolu: 0"
     - ✅ "Annulée: 0"

3. **Voir la réclamation dans la liste**
   - Vérifier que la réclamation est listée
   - Vérifier que le statut affiche "En cours"
   - Vérifier que la réponse de l'agent s'affiche: `"Merci pour votre signalement..."`

4. **Cliquer sur les détails**
   - Cliquer sur le bouton "Détails"
   - Vérifier que la réponse complète est visible

5. **Vérifier la réception de l'email** (optionnel)
   - Vérifier dans la file d'attente ou la boîte mail que l'email a été envoyé
   - Email contient: statut, réponse de l'agent

### **Phase 4: Agent Finalise la Réclamation**

1. **Retourner à la page de la réclamation**
   - Agent se reconnecte si nécessaire
   - Accès: `/agent/reclamations/3`

2. **Changer le statut à "Résolu"**
   - Cliquer sur le bouton "Résolu"
   - Ajouter un message: `"Problème résolu, merci de votre compréhension."`
   - Cliquer "Enregistrer la réponse"
   - **Résultat attendu**: "Réclamation mise à jour avec succès !"

3. **Vérifier que le client reçoit une notification**
   - Client reçoit un nouvel email: "L'agent a répondu à votre réclamation"

### **Phase 5: Tester l'Annulation**

1. **Agent annule une autre réclamation** (si disponible)
   - Accès: `/agent/reclamations/{autre_id}`
   - Cliquer sur "Annuler"
   - Ajouter un message: `"Problème annulé car réservation a été annulée."`
   - Cliquer "Enregistrer la réponse"

2. **Client voit le changement**
   - Client rafraîchit `/client/reclamations`
   - Vérifier que le compteur "Annulée" augmente

### **Phase 6: Tester l'Autorisation**

1. **Créer 2 réclamations avec des agents différents** (si possible)

2. **Agent 1 essaie d'accéder à la réclamation d'Agent 2**
   - Accès: `/agent/reclamations/99` (assignée à agent 2)
   - **Résultat attendu**: Erreur 403 "Accès refusé"

3. **Client essaie d'accéder à la réclamation d'un autre client** (si possible)
   - **Résultat attendu**: Erreur 403 "Accès refusé"

---

## 🔍 Vérifications Techniques

### **API Endpoints à Tester**

```bash
# 1. Dashboard Stats
GET /api/v1/dashboard/stats
Authorization: Bearer {agent_token}
# Résultat attendu: 200 OK avec statistiques

# 2. Lister les réclamations
GET /api/v1/complaints
Authorization: Bearer {token}
# Résultat attendu: 200 OK avec liste

# 3. Détail de la réclamation
GET /api/v1/complaints/3
Authorization: Bearer {token}
# Résultat attendu: 200 OK avec tous les détails

# 4. Mettre à jour la réclamation
PATCH /api/v1/complaints/3
Authorization: Bearer {agent_token}
Content-Type: application/json
{
  "statut": "en_cours",
  "agent_response": "Merci pour votre signalement..."
}
# Résultat attendu: 200 OK avec données mises à jour
```

### **Vérifier les Logs**

```bash
# Vérifier les erreurs PHP
cd backend
tail -f storage/logs/laravel.log

# Vérifier les emails en file d'attente (si configuré)
php artisan queue:listen
```

### **Vérifier la Base de Données**

```sql
-- Vérifier les réclamations
SELECT id, statut, agent_response, created_at, updated_at 
FROM reclamations 
ORDER BY updated_at DESC;

-- Vérifier les réservations
SELECT id, statut, agent_id, client_id 
FROM reservations 
WHERE agent_id = 2;
```

---

## 🎯 Checklist de Validation

- [ ] Dashboard Agent charge sans erreur 500
- [ ] Agent peut voir la liste des réclamations
- [ ] Agent peut voir les détails d'une réclamation
- [ ] Agent voit 3 boutons: "Traiter | Résolu | Annuler" (pas "Ouverte")
- [ ] Agent peut ajouter une réponse
- [ ] Agent peut cliquer "Enregistrer la réponse"
- [ ] La page affiche "Sauvegardé avec succès"
- [ ] Client reçoit une notification email
- [ ] Client voit le statut mis à jour
- [ ] Client voit la réponse de l'agent
- [ ] Compteurs à jour pour les statuts
- [ ] Autorisation correctement appliquée (403 pour accès non autorisé)
- [ ] Pas d'erreur 500 dans les logs

---

## 🐛 Dépannage

### **Erreur 500 sur `/dashboard/stats`**
- ✅ FIXED: Changeré `status` par `statut` dans `RealEstateController`

### **Erreur 500 sur `/complaints/3`**
- ✅ FIXED: Ajouté vérifications d'autorisation dans `ReclamationController.show()`

### **Bouton "Ouverte" s'affiche toujours**
- ✅ FIXED: Mis à jour `statusOpts` dans le fichier agent/reclamations/[id]/page.vue

### **Client ne reçoit pas d'email**
- Vérifier: `.env` a les bonnes variables `MAIL_*`
- Vérifier: Laravel queue listener est lancé
- Vérifier: `ReclamationResponseNotification` envoie l'email

### **Erreur d'autorisation (403)**
- Normal si l'agent n'est pas assigné à la réclamation
- Ou si le client n'a pas créé la réclamation

---

## 📞 Support

Si vous rencontrez d'autres erreurs:
1. Vérifier les logs: `backend/storage/logs/laravel.log`
2. Vérifier la console frontend pour les erreurs JavaScript
3. Vérifier que la base de données est à jour: `php artisan migrate:status`
