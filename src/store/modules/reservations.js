import { reservations, reservationsJeux, reservationStandJeu } from "@/datasource/data";

const state = {
  reservations: reservations,
  reservationsJeux: reservationsJeux,
  reservationStand: reservationStandJeu
};

const mutations = {
  ADD_RESERVATION(state, reservation) {
    state.reservations.push(reservation);
  },
  ADD_RESERVATION_JEUX(state, reservationJeu) {
    state.reservationsJeux.push(reservationJeu);
  },
  SET_RESERVATIONS(state, reservations) {
    state.reservations = reservations;
  },
  SET_RESERVATIONS_JEUX(state, reservationJeu) {
    state.reservationsJeux = reservationJeu;
  },
  SET_RESERVATIONS_STANDJEU(state, reservationStandJeu) {
    state.reservationStand = reservationStandJeu;
  }
};

const actions = {
  addReservation({ commit }, reservation) {
    commit('ADD_RESERVATION', reservation);
  },
  addReservationJeux({ commit }, reservationJeu) {
    commit('ADD_RESERVATION_JEUX', reservationJeu);
  },
  fetchUserReservations({ commit }, userId) {
    const userReservations = reservations.filter(res => res.userId === userId);
    commit('SET_RESERVATIONS', userReservations);
  },
  fetchUserReservationsJeux({ commit }, userId) {
    const userReservationsJeux = reservationsJeux.filter(res => res.userId === userId);
    commit('SET_RESERVATIONS_JEUX', userReservationsJeux);
  },
  fetchUserReservationsStandJeu({ commit }, userId) {
    const userReservationsStandJeu = reservationStandJeu.filter(res => res.userId === userId);
    commit('SET_RESERVATIONS_STANDJEU', userReservationsStandJeu);
  }
};

const getters = {
  userReservations: (state, getters, rootState) => {
    if (rootState.auth.userSession) {
      return state.reservations.filter(res => res.userId === rootState.auth.userSession.id);
    }
    return [];
  },
  userReservationsJeux: (state, getters, rootState) => {
    if (rootState.auth.userSession) {
      return state.reservationsJeux.filter(res => res.userId === rootState.auth.userSession.id);
    }
    return [];
  },
  userReservationsStandJeu: (state, getters, rootState) => {
    if (rootState.auth.userSession) {
      return state.reservationStand.filter(res => res.userId === rootState.auth.userSession.id);
    }
    return [];
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};