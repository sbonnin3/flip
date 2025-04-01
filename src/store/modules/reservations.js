export default {
    namespaced: true,
    state: {
      reservations: [],
      reservationsJeux: [],
      reservationStand: []
    },
    mutations: {
      SET_RESERVATIONS(state, reservations) {
        state.reservations = reservations;
      }
    },
    actions: {
      fetchUserReservations({ commit }, userId) {
        const userReservations = require("@/datasource/data").reservations.filter(reservation => reservation.userId === userId);
        commit('SET_RESERVATIONS', userReservations);
      }
    }
  };
  