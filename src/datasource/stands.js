export const stands = [
    // {
    //     id: int, //= id du stand
    //     nom: String, //= nom du stand
    //     type: String, //= type de stand
    //     image: chemin_image_png, //= lien de l'image du prestataire
    //     idPoint: int, //= numéro du point sur la carte
    //     comptes: [int], //= id du compte du prestataire
    // },
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
        idRestau: "R1",
        nom: 'L\'orientale',
        type: "restaurants",
        image: require('@/assets/images/Lorientale.png'),
        idPoint: 7,
        comptes: [12342],
        nourritures: [
            {nom: "Couscous", prix: 12, image: require('@/assets/images/couscous.png')},
            {nom: "Burger", prix: 8, image: require('@/assets/images/burger.png')},
            {nom: "Kebab", prix: 9, image: require('@/assets/images/kebab.png')},
            {nom: "Frites", prix: 6, image: require('@/assets/images/frites.png')},
        ],
        boissons: [
            {nom: "Coca", prix: 3, image: require('@/assets/images/coca.png')},
            {nom: "Coca zéro", prix: 4, image: require('@/assets/images/coca_zero.png')},
            {nom: "Fanta", prix: 3.50, image: require('@/assets/images/fanta.png')},
        ]
    },
    {
        id: 1236,
        idRestau: "R2",
        nom: 'Derya',
        type: "restaurants",
        image: require('@/assets/images/Derya.png'),
        idPoint: 11,
        comptes: [12342],
        nourritures: [
            {nom: "Tacos", prix: 8, image: require('@/assets/images/tacos.png')},
            {nom: "Crêpes turque", prix: 10, image: require('@/assets/images/crepe_turc.png')},
            {nom: "Kebab", prix: 9, image: require('@/assets/images/kebab.png')},
            {nom: "Frites", prix: 6, image: require('@/assets/images/frites.png')},
        ],
        boissons: [
            {nom: "Oasis", prix: 3.50, image: require('@/assets/images/oasis.png')},
            {nom: "Coca", prix: 3, image: require('@/assets/images/coca.png')},
            {nom: "Coca zéro", prix: 4, image: require('@/assets/images/coca_zero.png')},
            {nom: "Fuzetea", prix: 2.50, image: require('@/assets/images/fuzetea.png')},
        ]
    },
    {
        id: 1237,
        idRestau: "R3",
        nom: 'Breizh Gaufres',
        type: "restaurants",
        image: require('@/assets/images/breizh_gauffres.png'),
        idPoint: 10,
        comptes: [12342],
        nourritures: [
            {nom: "Gaufre aux sucre", prix: 5, image: require('@/assets/images/gaufre_sucre.png')},
            {nom: "Gaufre nutella", prix: 7, image: require('@/assets/images/gaufre_nutella.png')},
            {nom: "Gaufre confiture", prix: 8.50, image: require('@/assets/images/gaufre_confiture.png')},
            {nom: "Gaufre salé ", prix: 6, image: require('@/assets/images/gaufre_salée.png')},

        ],
        boissons: [
            {nom: "Oasis", prix: 3, image: require('@/assets/images/oasis.png')},
            {nom: "Coca", prix: 3, image: require('@/assets/images/coca.png')},
            {nom: "Coca zéro", prix: 4, image: require('@/assets/images/coca_zero.png')},
            {nom: "Fanta", prix: 3.50, image: require('@/assets/images/fanta.png')},
        ]
    },
    {
        id: 1238,
        idRestau: "R4",
        nom: 'Dream Bubble',
        type: "restaurants",
        image: require('@/assets/images/dreambubble.png'),
        idPoint: 9,
        comptes: [12342],
        nourritures: [
            {nom: "Barbe à papa", prix: 5, image: require('@/assets/images/barbapapa.png')},
            {nom: "Crêpe aux sucres", prix: 5, image: require('@/assets/images/crepe_sucre.png')},
            {nom: "Crêpe nutella", prix: 6, image: require('@/assets/images/crepe_nutella.png')},
            {nom: "Churros", prix: 5, image: require('@/assets/images/churros.png')},
            {nom: "Glace (parfum au choix)", prix: 4.50, image: require('@/assets/images/glaces.png')},
            {nom: "Hot dog", prix: 7, image: require('@/assets/images/hot_dog.png')},
            {nom: "Frites", prix: 6, image: require('@/assets/images/frites.png')},

        ],
        boissons: [
            {nom: "Oasis", prix: 3, image: require('@/assets/images/oasis.png')},
            {nom: "Coca", prix: 3.50, image: require('@/assets/images/coca.png')},
            {nom: "Coca zéro", prix: 4, image: require('@/assets/images/coca_zero.png')},
            {nom: "Orangina", prix: 3, image: require('@/assets/images/orangina.png')},
            {nom: "Fanta", prix: 4, image: require('@/assets/images/fanta.png')},
        ]
    },
    {
        id: 1239,
        idRestau: "R5",
        nom: 'Pralinette',
        type: "restaurants",
        image: require('@/assets/images/pralinette.png'),
        idPoint: 8,
        comptes: [12342],
        nourritures: [
            {nom: "Chouquette", prix: 5, image: require('@/assets/images/chouquette.png')},
            {nom: "Pralines", prix: 4, image: require('@/assets/images/pralines.png')},
            {nom: "Cookies", prix: 5.50, image: require('@/assets/images/cookies.png')},
            {nom: "Churros", prix: 5, image: require('@/assets/images/churros.png')},

        ],
        boissons: [
            {nom: "Oasis", prix: 3, image: require('@/assets/images/oasis.png')},
            {nom: "Fanta", prix: 4, image: require('@/assets/images/fanta.png')},
            {nom: "Orangina", prix: 3.50, image: require('@/assets/images/orangina.png')},
        ]
    },

];

  