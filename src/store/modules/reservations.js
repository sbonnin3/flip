export default {
    namespaced: true,
    state: {
        allReservationsStand: [],
        userReservations: [],
        userReservationsJeux: [],
        userReservationStandJeu: [],
        reservations: [],
        reservationStandJeu: []
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
        },
        ADD_RESERVATION(state, reservation) {
            state.reservations.push({
                ...reservation,
                id: Date.now().toString() // Ajout d'un ID unique
            });
        },
        ADD_STAND_RESERVATION(state, reservation) {
            state.reservationStandJeu.push({
                ...reservation,
                id: Date.now().toString() // Ajout d'un ID unique
            });
        },
        SET_RESERVATIONS(state, reservations) {
            state.reservations = reservations;
        },
        SET_RESERVATION_STAND_JEU(state, reservationStandJeu) {
            state.reservationStandJeu = reservationStandJeu;
        }
    },
    actions: {
        async fetchAllReservationsStand({ commit }) {
            try {
                const { reservationStandJeu } = require("@/datasource/data");
                commit('SET_ALL_RESERVATIONS_STAND', reservationStandJeu);
                commit('SET_RESERVATION_STAND_JEU', reservationStandJeu);
            } catch (error) {
                console.error("Erreur chargement réservations stand:", error);
                commit('SET_ALL_RESERVATIONS_STAND', []);
                commit('SET_RESERVATION_STAND_JEU', []);
            }
        },
        async fetchReservations({ commit }) {
            try {
                const { reservations } = require("@/datasource/data");
                commit('SET_RESERVATIONS', reservations);
            } catch (error) {
                console.error("Erreur chargement réservations:", error);
                commit('SET_RESERVATIONS', []);
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
        },
        async addReservation({ commit, rootState }, reservation) {
            if (!rootState.user.userSession?.id) {
                throw new Error("Utilisateur non connecté");
            }
            commit('ADD_RESERVATION', reservation);
            return reservation;
        },
        async addStandReservation({ commit, rootState }, reservation) {
            if (!rootState.user.userSession?.id) {
                throw new Error("Utilisateur non connecté");
            }
            if (!reservation.standID) {
                throw new Error("Stand non valide");
            }
            commit('ADD_STAND_RESERVATION', reservation);
            return reservation;
        },
    },
    getters: {
        allReservationsStand: state => state.allReservationsStand || [],
        userReservations: state => state.userReservations || [],
        userReservationsJeux: state => state.userReservationsJeux || [],
        userReservationStandJeu: state => state.userReservationStandJeu || [],
        reservations: state => state.reservations || [],
        reservationStandJeu: state => state.reservationStandJeu || [],
        reservationsByPrestataire: (state, getters, rootState) => (prestataireId) => {
            return state.reservations.filter(reservation => {
                const tournoi = rootState.tournois.tournois.find(t => t._id === reservation.tournoiId);
                return tournoi && tournoi.prestataireId === prestataireId;
            });
        }
    }
};