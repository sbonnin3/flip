export default {
    namespaced: true,
    state: {
        allReservationsStand: [],  // Ajouté pour la gestion globale
        userReservations: [],
        userReservationsJeux: [],
        userReservationStandJeu: []
    },
    mutations: {
        SET_ALL_RESERVATIONS_STAND(state, reservations) {
            state.allReservationsStand = reservations;
        },
        SET_USER_RESERVATIONS(state, reservations) {
            state.userReservations = reservations;
        },
        SET_USER_RESERVATIONS_JEUX(state, reservations) {
            state.userReservationsJeux = reservations;
        },
        SET_USER_RESERVATIONS_STAND(state, reservations) {
            state.userReservationStandJeu = reservations;
        }
    },
    actions: {
        async fetchAllReservationsStand({ commit }) {
            try {
                const { reservationStandJeu } = require("@/datasource/data");
                commit('SET_ALL_RESERVATIONS_STAND', reservationStandJeu);
            } catch (error) {
                console.error("Erreur chargement réservations stand:", error);
                commit('SET_ALL_RESERVATIONS_STAND', []);
            }
        },
        async fetchUserData({ commit, rootState }) {
            try {
                const userId = rootState.user.userSession?.id;
                if (!userId) return;

                const data = require("@/datasource/data");

                commit('SET_USER_RESERVATIONS',
                    data.reservations.filter(r => r.userId === userId)
                );
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
        allReservationsStand: state => state.allReservationsStand || [],
        userReservations: state => state.userReservations || [],
        userReservationsJeux: state => state.userReservationsJeux || [],
        userReservationStandJeu: state => state.userReservationStandJeu || []
    }
};