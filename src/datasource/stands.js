import { restaurants } from "./prestataires/restaurants";

export const stands = [
    {
        id: 1234,
        nom: 'Boutique',
        type: "boutique",
        image: require('@/assets/images/stand_blackrock.png'),
        idPoint: 12,
        comptes: [12345],
        articles: [
            {nom: "Gobbit", prix: 10}
        ]
    },
    {
        id: 1235,
        nom: 'Mie Caline',
        type: "restaurants",
        image: require('@/assets/images/stand_blackrock.png'),
        idPoint: 10,
        comptes: [12342],
        articles: [
            {nom: "burger", prix: 8, stock: 564},
            {nom: "cookie", prix: 3, stock: 564}
        ]
    },
];

export {
    restaurants,
};
  