# Flux de Travail des Réclamations

## 🎯 Vue d'ensemble

Le système de gestion des réclamations permet aux clients de déposer des plaintes liées à des réservations, aux agents de traiter ces plaintes, et aux clients de suivre la progression en temps réel.

## 📋 Statuts de Réclamation

| Statut | Couleur | Description |
|--------|--------|-------------|
| `ouverte` | Bleu | Nouvelle réclamation, en attente d'assignation à un agent |
| `en_cours` | Amber | L'agent est en train de traiter la réclamation |
| `traitee` | Vert | L'agent a résolu la réclamation et fourni une réponse |
| `fermee` | Gris | (Optionnel) Réclamation archivée ou fermée |

## 🔄 Flux Client

### 1. **Créer une Réclamation** 
- URL: `/client/reclamations/nouvelle`
- Sélectionner une réservation existante (statut: `confirmee`)
- Remplir le sujet et la description
- Clic sur "Envoyer"
- **Résultat**: Réclamation créée avec statut `ouverte`

### 2. **Voir la Liste des Réclamations**
- URL: `/client/reclamations`
- Affiche toutes les réclamations du client
- Filtre par statut: Tous | Ouvertes | En cours | Traitées
- Recherche par sujet
- Affiche la réponse de l'agent si disponible
- Chaque réclamation avec lien vers les détails

### 3. **Consulter les Détails**
- URL: `/client/reclamations/{id}`
- Voir les détails complets de la réclamation
- Afficher la réservation associée
- Afficher la réponse de l'agent (si disponible)
- Recevoir une notification email quand l'agent répond

## 👨‍💼 Flux Agent

### 1. **Voir la Liste des Réclamations**
- URL: `/agent/reclamations`
- Affiche les réclamations assignées à cet agent
- Affiche aussi les réclamations sans assignation (statut `ouverte` sans `agent_id`)
- Filtre par statut
- Recherche par client

### 2. **Traiter une Réclamation**
- URL: `/agent/reclamations/{id}`
- **Changer le statut**:
  - Cliquer sur les boutons: `Ouverte` → `En cours` → `Traitée`
  - Le bouton sélectionné se met en évidence
- **Ajouter une réponse**:
  - Remplir le champ "Votre réponse au client"
  - La réponse est sauvegardée dans le champ `agent_response`
- **Enregistrer**:
  - Clic sur "Enregistrer la réponse"
  - La réclamation est mise à jour avec le nouveau statut et la réponse
  - Une notification email est envoyée au client si une réponse est fournie

### 3. **Suivi**
- Voir le résumé de la réclamation avec le statut actuel
- Affichage de l'état de la réponse:
  - ✅ "Réponse envoyée" (si `agent_response` existe)
  - ⚠️ "En attente de réponse" (si pas de réponse)

## 📱 Mise à Jour en Temps Réel

### **Client -> Reçoit une Notification Email**
- Quand l'agent clique sur "Enregistrer la réponse"
- Email contient:
  - Le message de l'agent
  - Le statut actuel de la réclamation
  - Lien pour consulter les détails

### **Client -> Voit la Mise à Jour**
- Le client doit rafraîchir la page `/client/reclamations` pour voir le nouveau statut
- Ou cliquer sur les détails d'une réclamation pour voir la réponse

## 🔧 Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/complaints` | Lister les réclamations (client/agent) |
| GET | `/api/v1/complaints/{id}` | Détails d'une réclamation |
| POST | `/api/v1/complaints` | Créer une nouvelle réclamation |
| PATCH | `/api/v1/complaints/{id}` | Mettre à jour une réclamation |

### **Exemple de Requête PATCH (Agent)**
```json
{
  "statut": "en_cours",
  "agent_response": "Merci pour votre réclamation. Nous sommes en train d'enquêter sur le problème."
}
```

### **Exemple de Réponse**
```json
{
  "data": {
    "id": 1,
    "sujet": "Problème avec la climatisation",
    "message": "La climatisation ne fonctionne pas...",
    "statut": "en_cours",
    "agent_response": "Merci pour votre réclamation...",
    "client": { "id": 1, "user": { "name": "Fatou Diallo", "email": "fatou@example.com" } },
    "agent": { "id": 2, "name": "Awa Traoré", "email": "awa@example.com" },
    "created_at": "2024-05-06T10:30:00Z",
    "updated_at": "2024-05-06T14:45:00Z"
  }
}
```

## 🛠️ Modifications Récentes (Session)

### **Frontend - Vue 3**
1. **Fichier**: `frontend-vue/src/app/agent/reclamations/[id]/page.vue`
   - ✅ Corrigé l'erreur Vue: parenthèses pour nullish coalescing
   - ✅ Page agent pour traiter les réclamations avec changement de statut
   - ✅ Textarea pour la réponse de l'agent
   - ✅ Boutons de statut (Ouverte | En cours | Traitée)
   - ✅ Affichage des détails du client et de la réservation

2. **Fichier**: `frontend-vue/src/lib/api.ts`
   - ✅ Fonction `updateComplaint()` envoie maintenant `agent_response` au lieu de `description`
   - ✅ Cela déclenche la notification email côté backend

3. **Fichier**: `frontend-vue/src/app/client/reclamations/page.vue`
   - ✅ Liste des réclamations avec filtrage et recherche
   - ✅ Affichage de la réponse de l'agent si disponible
   - ✅ Compteurs par statut

### **Backend - Laravel**
1. **Fichier**: `backend/app/Http/Controllers/ReclamationController.php`
   - ✅ Méthode `update()` accepte `statut` et `agent_response`
   - ✅ Envoie `ReclamationResponseNotification` si `agent_response` est fournie

2. **Notification**: `app/Notifications/ReclamationResponseNotification.php`
   - ✅ Email envoyé au client quand l'agent répond
   - ✅ Contient le message et le statut de la réclamation

## ✅ Flux Complet Testé

1. **Client**: Crée une réclamation → `statut: ouverte`
2. **Agent**: Accède au détail → Change statut à `en_cours` et ajoute une réponse
3. **Backend**: Met à jour la réclamation + envoie email au client
4. **Client**: Reçoit l'email + voit le statut mis à jour après rafraîchissement

## 📝 Notes

- Les notifications email sont mises en file d'attente (queue) et traitées en arrière-plan
- L'agent peut changer le statut plusieurs fois avant d'envoyer une réponse
- La réponse de l'agent est obligatoire pour déclencher la notification email
- Le client peut rafraîchir la page pour voir les mises à jour en temps réel

## 🎯 Prochaines Améliorations Possibles

- [ ] Auto-refresh de la liste client toutes les 30 secondes
- [ ] WebSocket pour les notifications en temps réel
- [ ] Statut `fermee` pour archiver les réclamations
- [ ] Historique des changements de statut
- [ ] Pièces jointes (photos, documents)
