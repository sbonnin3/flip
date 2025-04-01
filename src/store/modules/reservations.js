export default {
    namespaced: true,
    state: {
        userReservations: [],    // Renommez pour correspondre à vos besoins
        userReservationsJeux: [],
        userReservationStandJeu: []  // Notez le 's' à Reservations
    },
    mutations: {
        SET_USER_RESERVATIONS(state, reservations) {
            state.userReservations = reservations;
        },
        SET_USER_RESERVATIONS_JEUX(state, reservations) {
            state.userReservationsJeux = reservations;
        },
        SET_USER_RESERVATIONS_STAND(state, reservations) {
            state.userReservationsStandJeu = reservations;
        }
    },
    actions: {
        async fetchUserData({ commit, rootState }) {
            try {
                const userId = rootState.user.userSession?.id;
                if (!userId) return;

                const data = require("@/datasource/data");

                // Filtrez les réservations
                commit('SET_USER_RESERVATIONS',
                    data.reservations.filter(r => r.userId === userId)
                );

                // Pour les autres données, ajoutez des filtres similaires
                // quand vous aurez les données correspondantes
                commit('SET_USER_RESERVATIONS_JEUX',
                    data.reservationsJeux.filter(r => r.userId === userId));
                commit('SET_USER_RESERVATIONS_STAND',
                    data.reservationStandJeu.filter(r => r.userId === userId));

            } catch (error) {
                console.error("Erreur chargement données:", error);
            }
        }
    },
    getters: {
        userReservations: state => state.userReservations || [],
        userReservationsJeux: state => state.userReservationsJeux || [],
        userReservationStandJeu: state => state.userReservationStandJeu || []
    }
};