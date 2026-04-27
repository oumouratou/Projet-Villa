export interface MockOption {
  id: string
  name: string
  icon: string
  description: string
}

export interface MockProperty {
  id: string
  title: string
  type: string
  description: string
  address: string
  city: string
  postalCode: string
  price: number
  pricePerNight: number
  surface: number
  bedrooms: number
  bathrooms: number
  capacity: number
  status: 'disponible' | 'reserve' | 'maintenance'
  images: string[]
  options: MockOption[]
  agentId: string
  createdAt: Date
}

export interface MockClient {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  status: 'actif' | 'inactif'
  createdAt: Date
}

export interface MockAgent {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'admin' | 'agent'
  status: 'actif' | 'inactif'
  createdAt: Date
}

export interface MockReservation {
  id: string
  propertyId: string
  property?: MockProperty
  clientId: string
  client?: MockClient
  startDate: Date
  endDate: Date
  status: 'en_attente' | 'confirmee' | 'refusee' | 'annulee'
  totalPrice: number
  agentComment?: string
  createdAt: Date
}

export interface MockComplaint {
  id: string
  reservationId?: string
  reservation?: MockReservation
  clientId: string
  subject: string
  description: string
  status: 'nouvelle' | 'ouverte' | 'en_cours' | 'traitee'
  agentResponse?: string
  createdAt: Date
  updatedAt: Date
}

export const mockOptions: MockOption[] = [
  { id: '1', name: 'WiFi', icon: 'wifi', description: 'Connexion internet haut debit' },
  { id: '2', name: 'Piscine', icon: 'waves', description: 'Piscine privee' },
  { id: '3', name: 'Parking', icon: 'car', description: 'Place de parking incluse' },
  { id: '4', name: 'Climatisation', icon: 'wind', description: 'Climatisation dans toutes les pieces' },
  { id: '5', name: 'Jardin', icon: 'trees', description: 'Jardin prive' },
  { id: '6', name: 'Television', icon: 'tv', description: 'TV ecran plat' },
]

export const mockProperties: MockProperty[] = [
  {
    id: 'prop-1',
    title: 'Villa moderne Cocody Riviera',
    type: 'villa',
    description: 'Magnifique villa de 4 chambres avec piscine et jardin tropical.',
    address: 'Riviera Golf, Rue des Ambassades',
    city: 'Abidjan',
    postalCode: '00225',
    price: 150000,
    pricePerNight: 150000,
    surface: 350,
    bedrooms: 4,
    bathrooms: 3,
    capacity: 8,
    status: 'disponible',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=900&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=900&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=900&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=900&fit=crop',
    ],
    options: [mockOptions[0], mockOptions[1], mockOptions[2], mockOptions[3]],
    agentId: 'agent-1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'prop-2',
    title: 'Appartement standing Plateau',
    type: 'appartement',
    description: 'Superbe appartement au coeur du Plateau avec vue lagune.',
    address: 'Boulevard Carde, Immeuble CCIA',
    city: 'Abidjan',
    postalCode: '00225',
    price: 85000,
    pricePerNight: 85000,
    surface: 120,
    bedrooms: 2,
    bathrooms: 2,
    capacity: 4,
    status: 'disponible',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=900&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=900&fit=crop',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&h=900&fit=crop',
    ],
    options: [mockOptions[0], mockOptions[2], mockOptions[5]],
    agentId: 'agent-1',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'prop-3',
    title: 'Villa bord de mer Assinie',
    type: 'villa',
    description: 'Villa pieds dans l eau avec acces direct a la plage.',
    address: 'Assinie-Mafia, front de mer',
    city: 'Assinie',
    postalCode: '00100',
    price: 250000,
    pricePerNight: 250000,
    surface: 400,
    bedrooms: 5,
    bathrooms: 4,
    capacity: 10,
    status: 'reserve',
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&h=900&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=900&fit=crop',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&h=900&fit=crop',
    ],
    options: [mockOptions[0], mockOptions[1], mockOptions[2], mockOptions[3], mockOptions[4]],
    agentId: 'agent-2',
    createdAt: new Date('2024-06-01'),
  },
]

export const mockClients: MockClient[] = [
  { id: 'client-1', firstName: 'Kouame', lastName: 'Aka', email: 'kouame.aka@gmail.com', phone: '+225 07 08 09 10 11', address: 'Cocody, Abidjan', status: 'actif', createdAt: new Date('2024-01-10') },
  { id: 'client-2', firstName: 'Aminata', lastName: 'Diallo', email: 'aminata.diallo@yahoo.fr', phone: '+225 05 06 07 08 09', address: 'Marcory, Abidjan', status: 'actif', createdAt: new Date('2024-02-25') },
  { id: 'client-3', firstName: 'Jean-Pierre', lastName: 'Kouassi', email: 'jp.kouassi@outlook.com', phone: '+225 01 02 03 04 05', address: 'Plateau, Abidjan', status: 'actif', createdAt: new Date('2024-03-18') },
]

export const mockAgents: MockAgent[] = [
  { id: 'agent-1', firstName: 'Marie', lastName: 'Kone', email: 'marie.kone@immogestion.ci', phone: '+225 27 22 XX XX XX', role: 'admin', status: 'actif', createdAt: new Date('2023-01-01') },
  { id: 'agent-2', firstName: 'Yao', lastName: 'Kouadio', email: 'yao.kouadio@immogestion.ci', phone: '+225 27 22 XX XX XX', role: 'agent', status: 'actif', createdAt: new Date('2023-06-15') },
  { id: 'agent-3', firstName: 'Awa', lastName: 'Traore', email: 'awa.traore@immogestion.ci', phone: '+225 27 22 XX XX XX', role: 'agent', status: 'inactif', createdAt: new Date('2023-09-20') },
]

export const mockReservations: MockReservation[] = [
  { id: 'res-1', propertyId: 'prop-1', property: mockProperties[0], clientId: 'client-1', client: mockClients[0], startDate: new Date('2024-08-01'), endDate: new Date('2024-08-07'), status: 'confirmee', totalPrice: 1050000, agentComment: 'Client regulier, excellent dossier.', createdAt: new Date('2024-07-15') },
  { id: 'res-2', propertyId: 'prop-2', property: mockProperties[1], clientId: 'client-2', client: mockClients[1], startDate: new Date('2024-08-15'), endDate: new Date('2024-08-20'), status: 'en_attente', totalPrice: 425000, createdAt: new Date('2024-08-01') },
  { id: 'res-3', propertyId: 'prop-3', property: mockProperties[2], clientId: 'client-3', client: mockClients[2], startDate: new Date('2024-09-01'), endDate: new Date('2024-09-10'), status: 'confirmee', totalPrice: 855000, agentComment: 'Sejour professionnel.', createdAt: new Date('2024-08-10') },
]

export const mockComplaints: MockComplaint[] = [
  { id: 'comp-1', reservationId: 'res-1', reservation: mockReservations[0], clientId: 'client-1', subject: 'Probleme de climatisation', description: 'La climatisation du salon ne fonctionne plus.', status: 'en_cours', createdAt: new Date('2024-08-03'), updatedAt: new Date('2024-08-04') },
  { id: 'comp-2', reservationId: 'res-3', reservation: mockReservations[2], clientId: 'client-3', subject: 'WiFi instable', description: 'La connexion internet est tres lente.', status: 'traitee', agentResponse: 'Probleme resolu.', createdAt: new Date('2024-09-04'), updatedAt: new Date('2024-09-05') },
  { id: 'comp-3', clientId: 'client-2', subject: 'Question sur annulation', description: 'Merci de preciser les conditions d annulation.', status: 'nouvelle', createdAt: new Date('2024-08-05'), updatedAt: new Date('2024-08-05') },
]
