// Données JSON contenant les commandes des restaurants

export const commandes = [
    {
        commandeId: 1,
        userId: 12346,
        restaurantNom: 'Derya',
        orderNumber: "42",
        articles: [
            { nom: "Tacos", quantite: 2, prix: 8 },
            { nom: "Frites", quantite: 1, prix: 6 }
        ],
        pickupTime: "12:30",
    },
    {
        commandeId: 2,
        userId: 12347,
        restaurantNom: 'Breizh Gaufres',
        orderNumber: "5",
        articles: [
            { nom: "Gaufre aux sucre", quantite: 1, prix: 5 },
            { nom: "Oasis", quantite: 1, prix: 3 }
        ],
        pickupTime: "16:30",
    },
    {
        commandeId: 3,
        userId: 12347,
        restaurantNom: 'Dream Bubble',
        orderNumber: "12",
        articles: [
            { nom: "Barbe à papa", quantite: 1, prix: 5 },
            { nom: "Orangina", quantite: 1, prix: 3 }
        ],
        pickupTime: "17:00",
    },
    {
        commandeId: 4,
        userId: 12346,
        restaurantNom: 'L\'orientale',
        orderNumber: "1563",
        articles: [
            { nom: "Couscous", quantite: 1, prix: 12 },
            { nom: "Kebab", quantite: 1, prix: 9 },
            { nom: "Frites", quantite: 1, prix: 6 },
            { nom: "Fanta", quantite: 1, prix: 3.50 },
        ],
        pickupTime: "12:00",
    },

]