
// JSON contenant les données des tournois

export const tournois = [
    {
        _id: "000001",
        nom: "Molkky",
        prix: 5,
        lieu: "Domaine des loges",
        dates: [
            { annee: 2025, mois: 7, jour: 10, heures: 19, min: 0, placesRestantes: 25 },
            { annee: 2025, mois: 7, jour: 12, heures: 18, min: 30, placesRestantes: 20 },
            { annee: 2025, mois: 7, jour: 14, heures: 18, min: 0, placesRestantes: 30 },
        ],
        description: "Participez à un tournoi de Molkky, le célèbre jeu de quilles finlandaises.",
        prestataireId: 12344,
        image: require('@/assets/images/tournois_molkky.png'),
    },
    {
        _id: "000002",
        nom: "Corn Hole",
        prix: 5,
        lieu: "Domaine des loges",
        dates: [
            { annee: 2025, mois: 7, jour: 9, heures: 19, min: 0, placesRestantes: 15 },
            { annee: 2025, mois: 7, jour: 11, heures: 18, min: 0, placesRestantes: 15 },
            { annee: 2025, mois: 7, jour: 13, heures: 17, min: 30, placesRestantes: 15 },
        ],
        description: "Affrontez d'autres participants dans un tournoi de Corn Hole.",
        prestataireId: 12354,
        image: require('@/assets/images/tournois_cornhole.png'),
    },
    {
        _id: "000003",
        nom: "Paintball",
        prix: 20,
        lieu: "Château de Parthenay",
        dates: [
            { annee: 2025, mois: 7, jour: 10, heures: 14, min: 0, placesRestantes: 10 },
            { annee: 2025, mois: 7, jour: 14, heures: 15, min: 30, placesRestantes: 10 },
            { annee: 2025, mois: 7, jour: 18, heures: 13, min: 0, placesRestantes: 10 },
        ],
        description: "Une bataille de paintball en équipe dans un cadre unique.",
        prestataireId: 12355,
        image: require('@/assets/images/tournois_paintball.png'),
    },
    {
        _id: "000004",
        nom: "Rocket League",
        prix: 5,
        lieu: "Palais des congrès",
        dates: [
            { annee: 2025, mois: 7, jour: 9, heures: 15, min: 0, placesRestantes: 30 },
            { annee: 2025, mois: 7, jour: 12, heures: 16, min: 30, placesRestantes: 30 },
            { annee: 2025, mois: 7, jour: 16, heures: 14, min: 0, placesRestantes: 30 },
        ],
        description: "Un tournoi e-sport de Rocket League pour les passionnés de jeux vidéo.",
        prestataireId: 12356,
        image: require('@/assets/images/tournois_rocketleague.png'),
    },
    {
        _id: "000005",
        nom: "Escape Game",
        prix: 17,
        lieu: "Tour de la poudrière",
        dates: [
            { annee: 2025, mois: 7, jour: 10, heures: 14, min: 30, placesRestantes: 12 },
            { annee: 2025, mois: 7, jour: 13, heures: 15, min: 0, placesRestantes: 12 },
            { annee: 2025, mois: 7, jour: 17, heures: 16, min: 0, placesRestantes: 12 },
        ],
        description: "Mettez-vous au défi dans cet escape game spécialement conçu pour le festival.",
        prestataireId: 12357,
        image: require('@/assets/images/tournois_escapegame.png'),
    },
    {
        _id: "000006",
        nom: "Basketball",
        prix: 3,
        lieu: "Place du drapeau",
        dates: [
            { annee: 2025, mois: 7, jour: 11, heures: 9, min: 0, placesRestantes: 25 },
            { annee: 2025, mois: 7, jour: 15, heures: 10, min: 30, placesRestantes: 25 },
            { annee: 2025, mois: 7, jour: 20, heures: 8, min: 0, placesRestantes: 25 },
        ],
        description: "Un tournoi de basketball 3 contre 3.",
        prestataireId: 12358,
        image: require('@/assets/images/tournois_basketball.png'),
    },
    {
        _id: "000007",
        nom: "Gobbit",
        prix: 5,
        lieu: "Place du drapeau",
        dates: [
            { annee: 2025, mois: 7, jour: 9, heures: 16, min: 0, placesRestantes: 20 },
            { annee: 2025, mois: 7, jour: 14, heures: 17, min: 30, placesRestantes: 20 },
            { annee: 2025, mois: 7, jour: 18, heures: 15, min: 0, placesRestantes: 20 },
        ],
        description: "Un tournoi du jeu de société Gobbit.",
        prestataireId: 12359,
        image: require('@/assets/images/tournois_gobbit.png'),
    },
];
