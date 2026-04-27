import type { Property, Client, Agent, Reservation, Complaint, PropertyOption } from "./types"

export const mockOptions: PropertyOption[] = [
  { id: "1", name: "WiFi", icon: "wifi", description: "Connexion internet haut debit" },
  { id: "2", name: "Piscine", icon: "waves", description: "Piscine privee" },
  { id: "3", name: "Parking", icon: "car", description: "Place de parking incluse" },
  { id: "4", name: "Climatisation", icon: "wind", description: "Climatisation dans toutes les pieces" },
  { id: "5", name: "Jardin", icon: "trees", description: "Jardin prive" },
  { id: "6", name: "Television", icon: "tv", description: "TV ecran plat" },
  { id: "7", name: "Cuisine equipee", icon: "utensils", description: "Cuisine entierement equipee" },
  { id: "8", name: "Securite 24h", icon: "shield", description: "Gardiennage et securite" },
]

export const mockProperties: Property[] = [
  {
    id: "prop-1",
    title: "Villa moderne Cocody Riviera",
    type: "villa",
    description: "Magnifique villa de 4 chambres avec piscine et jardin tropical. Situee dans le quartier residentiel de Cocody Riviera, cette propriete offre un cadre de vie exceptionnel avec ses espaces de vie lumineux et sa terrasse panoramique.",
    address: "Riviera Golf, Rue des Ambassades",
    city: "Abidjan",
    pricePerNight: 150000,
    surface: 350,
    bedrooms: 4,
    bathrooms: 3,
    capacity: 8,
    status: "disponible",
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"],
    options: ["1", "2", "3", "4", "5", "6", "7"],
    agentId: "agent-1",
    createdAt: "2024-01-15"
  },
  {
    id: "prop-2",
    title: "Appartement standing Plateau",
    type: "appartement",
    description: "Superbe appartement au coeur du Plateau, quartier des affaires d'Abidjan. Vue imprenable sur la lagune, finitions haut de gamme et securite 24h/24.",
    address: "Boulevard Carde, Immeuble CCIA",
    city: "Abidjan",
    pricePerNight: 85000,
    surface: 120,
    bedrooms: 2,
    bathrooms: 2,
    capacity: 4,
    status: "disponible",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"],
    options: ["1", "3", "4", "6", "7", "8"],
    agentId: "agent-1",
    createdAt: "2024-02-20"
  },
  {
    id: "prop-3",
    title: "Studio meuble Marcory",
    type: "studio",
    description: "Studio moderne et fonctionnel, ideal pour sejour d'affaires ou tourisme. Proche de tous commerces et transports.",
    address: "Zone 4, Rue du Commerce",
    city: "Abidjan",
    pricePerNight: 35000,
    surface: 35,
    bedrooms: 1,
    bathrooms: 1,
    capacity: 2,
    status: "reserve",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"],
    options: ["1", "4", "6", "7"],
    agentId: "agent-2",
    createdAt: "2024-03-10"
  },
  {
    id: "prop-4",
    title: "Duplex luxe Angre",
    type: "duplex",
    description: "Magnifique duplex de 180m2 dans une residence securisee. 3 chambres, grand salon avec mezzanine, cuisine americaine equipee.",
    address: "Angre 8eme Tranche",
    city: "Abidjan",
    pricePerNight: 95000,
    surface: 180,
    bedrooms: 3,
    bathrooms: 2,
    capacity: 6,
    status: "disponible",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"],
    options: ["1", "3", "4", "6", "7", "8"],
    agentId: "agent-1",
    createdAt: "2024-04-05"
  },
  {
    id: "prop-5",
    title: "Maison coloniale Bingerville",
    type: "maison",
    description: "Charmante maison de style colonial entierement renovee. Grand jardin arbore, veranda spacieuse, ambiance paisible.",
    address: "Quartier France, Bingerville",
    city: "Bingerville",
    pricePerNight: 75000,
    surface: 200,
    bedrooms: 3,
    bathrooms: 2,
    capacity: 6,
    status: "disponible",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"],
    options: ["1", "3", "5", "6", "7"],
    agentId: "agent-2",
    createdAt: "2024-05-12"
  },
  {
    id: "prop-6",
    title: "Villa bord de mer Assinie",
    type: "villa",
    description: "Exceptionnelle villa les pieds dans l'eau a Assinie. Acces direct a la plage, piscine a debordement, personnel de maison inclus.",
    address: "Assinie-Mafia, front de mer",
    city: "Assinie",
    pricePerNight: 250000,
    surface: 400,
    bedrooms: 5,
    bathrooms: 4,
    capacity: 10,
    status: "disponible",
    images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop"],
    options: ["1", "2", "3", "4", "5", "6", "7", "8"],
    agentId: "agent-1",
    createdAt: "2024-06-01"
  },
  {
    id: "prop-7",
    title: "Appartement Yamoussoukro centre",
    type: "appartement",
    description: "Bel appartement au centre de Yamoussoukro, a proximite de la Basilique. Ideal pour decouvrir la capitale politique.",
    address: "Quartier Habitat, Avenue Houphouet-Boigny",
    city: "Yamoussoukro",
    pricePerNight: 45000,
    surface: 80,
    bedrooms: 2,
    bathrooms: 1,
    capacity: 4,
    status: "disponible",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"],
    options: ["1", "3", "4", "6", "7"],
    agentId: "agent-2",
    createdAt: "2024-06-15"
  },
  {
    id: "prop-8",
    title: "Villa Grand-Bassam historique",
    type: "villa",
    description: "Villa de charme dans le quartier historique de Grand-Bassam, classee au patrimoine mondial UNESCO. Architecture coloniale restauree avec gout.",
    address: "Quartier France, Grand-Bassam",
    city: "Grand-Bassam",
    pricePerNight: 120000,
    surface: 280,
    bedrooms: 4,
    bathrooms: 3,
    capacity: 8,
    status: "maintenance",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"],
    options: ["1", "3", "5", "6", "7"],
    agentId: "agent-1",
    createdAt: "2024-07-01"
  }
]

export const mockClients: Client[] = [
  {
    id: "client-1",
    firstName: "Kouame",
    lastName: "Aka",
    email: "kouame.aka@gmail.com",
    phone: "+225 07 08 09 10 11",
    address: "Cocody, Abidjan",
    status: "actif",
    createdAt: "2024-01-10"
  },
  {
    id: "client-2",
    firstName: "Aminata",
    lastName: "Diallo",
    email: "aminata.diallo@yahoo.fr",
    phone: "+225 05 06 07 08 09",
    address: "Marcory, Abidjan",
    status: "actif",
    createdAt: "2024-02-25"
  },
  {
    id: "client-3",
    firstName: "Jean-Pierre",
    lastName: "Kouassi",
    email: "jp.kouassi@outlook.com",
    phone: "+225 01 02 03 04 05",
    address: "Plateau, Abidjan",
    status: "actif",
    createdAt: "2024-03-18"
  },
  {
    id: "client-4",
    firstName: "Fatou",
    lastName: "Bamba",
    email: "fatou.bamba@gmail.com",
    phone: "+225 07 77 88 99 00",
    address: "Yopougon, Abidjan",
    status: "actif",
    createdAt: "2024-04-05"
  },
  {
    id: "client-5",
    firstName: "Stephane",
    lastName: "N'Guessan",
    email: "stephane.nguessan@email.ci",
    phone: "+225 05 55 66 77 88",
    address: "Angre, Abidjan",
    status: "inactif",
    createdAt: "2024-05-20"
  }
]

export const mockAgents: Agent[] = [
  {
    id: "agent-1",
    firstName: "Marie",
    lastName: "Kone",
    email: "marie.kone@immogestion.ci",
    phone: "+225 27 22 XX XX XX",
    role: "admin",
    status: "actif",
    createdAt: "2023-01-01"
  },
  {
    id: "agent-2",
    firstName: "Yao",
    lastName: "Kouadio",
    email: "yao.kouadio@immogestion.ci",
    phone: "+225 27 22 XX XX XX",
    role: "agent",
    status: "actif",
    createdAt: "2023-06-15"
  },
  {
    id: "agent-3",
    firstName: "Awa",
    lastName: "Traore",
    email: "awa.traore@immogestion.ci",
    phone: "+225 27 22 XX XX XX",
    role: "agent",
    status: "actif",
    createdAt: "2023-09-20"
  },
  {
    id: "agent-4",
    firstName: "Olivier",
    lastName: "Dje",
    email: "olivier.dje@immogestion.ci",
    phone: "+225 27 22 XX XX XX",
    role: "agent",
    status: "inactif",
    createdAt: "2024-01-10"
  }
]

export const mockReservations: Reservation[] = [
  {
    id: "res-1",
    propertyId: "prop-1",
    clientId: "client-1",
    startDate: "2024-08-01",
    endDate: "2024-08-07",
    status: "confirmee",
    totalPrice: 1050000,
    agentComment: "Client regulier, excellent dossier.",
    createdAt: "2024-07-15"
  },
  {
    id: "res-2",
    propertyId: "prop-2",
    clientId: "client-2",
    startDate: "2024-08-15",
    endDate: "2024-08-20",
    status: "en_attente",
    totalPrice: 425000,
    createdAt: "2024-08-01"
  },
  {
    id: "res-3",
    propertyId: "prop-4",
    clientId: "client-3",
    startDate: "2024-09-01",
    endDate: "2024-09-10",
    status: "confirmee",
    totalPrice: 855000,
    agentComment: "Sejour professionnel, facture entreprise.",
    createdAt: "2024-08-10"
  },
  {
    id: "res-4",
    propertyId: "prop-6",
    clientId: "client-1",
    startDate: "2024-09-15",
    endDate: "2024-09-22",
    status: "en_attente",
    totalPrice: 1750000,
    createdAt: "2024-08-25"
  },
  {
    id: "res-5",
    propertyId: "prop-3",
    clientId: "client-4",
    startDate: "2024-08-10",
    endDate: "2024-08-15",
    status: "refusee",
    totalPrice: 175000,
    agentComment: "Dossier incomplet, documents manquants.",
    createdAt: "2024-07-28"
  },
  {
    id: "res-6",
    propertyId: "prop-5",
    clientId: "client-2",
    startDate: "2024-10-01",
    endDate: "2024-10-05",
    status: "en_attente",
    totalPrice: 300000,
    createdAt: "2024-09-10"
  }
]

export const mockComplaints: Complaint[] = [
  {
    id: "comp-1",
    reservationId: "res-1",
    clientId: "client-1",
    subject: "Probleme de climatisation",
    description: "La climatisation du salon ne fonctionne plus depuis hier soir. La temperature est insupportable.",
    status: "en_cours",
    createdAt: "2024-08-03",
    updatedAt: "2024-08-04"
  },
  {
    id: "comp-2",
    reservationId: "res-3",
    clientId: "client-3",
    subject: "WiFi instable",
    description: "La connexion internet est tres lente et se deconnecte regulierement. J'ai besoin d'une connexion stable pour mon travail.",
    status: "traitee",
    agentResponse: "Technicien intervenu le 05/09. Probleme de routeur resolu, connexion retablie.",
    createdAt: "2024-09-04",
    updatedAt: "2024-09-05"
  },
  {
    id: "comp-3",
    clientId: "client-2",
    subject: "Question sur les conditions d'annulation",
    description: "Je souhaite connaitre les conditions exactes d'annulation de ma reservation. Les informations sur le site ne sont pas claires.",
    status: "ouverte",
    createdAt: "2024-08-05",
    updatedAt: "2024-08-05"
  },
  {
    id: "comp-4",
    reservationId: "res-1",
    clientId: "client-1",
    subject: "Piscine non entretenue",
    description: "L'eau de la piscine est trouble et semble mal entretenue. Cela ne correspond pas aux photos de l'annonce.",
    status: "ouverte",
    createdAt: "2024-08-06",
    updatedAt: "2024-08-06"
  }
]
