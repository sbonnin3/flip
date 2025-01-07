import Vue from 'vue';
import Vuex from 'vuex';
import {commandes, reservations, reservationsJeux, comptes} from "@/datasource/data";
import { getAllTournois } from '@/services/tournoisService';
import { getAllJeux } from "@/services/jeuxService";
import { getAllSouvenirs } from "@/services/souvenirsService";
import { getAllStands } from "@/services/standsService";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tournois: [],
    jeux: [],
    comptes: comptes,
    userSession: null,
    souvenirs: [],
    reservations: reservations,
    reservationsJeux: reservationsJeux,
    userOrders: commandes,
    currentOrder: [],
    stands: [],
  },
  mutations: {
    SET_USER_SESSION(state, user) {
      state.userSession = user;
    },
    REMOVE_COMPTE(state, id) {
      state.comptes = state.comptes.filter((compte) => compte.id !== id);
    },
    UPDATE_COMPTE(state, updatedCompte) {
      const index = state.comptes.findIndex((compte) => compte.id === updatedCompte.id);
      if (index !== -1) {
        state.comptes.splice(index, 1, updatedCompte);
      }
    },
    SET_TOURNOIS(state, tournois) {
      state.tournois = tournois;
    },
    SET_JEUX(state, jeux){
      state.jeux = jeux;
    },
    CLEAR_USER_SESSION(state) {
      state.userSession = null;
    },
    ADD_COMPTE(state, nouveauCompte) {
      state.comptes.push(nouveauCompte);
    },
    ADD_RESERVATION(state, reservation) {
      Vue.set(state.reservations, state.reservations.length, reservation);
    },
    ADD_RESERVATION_JEUX(state, reservationJeu){
      Vue.set(state.reservationsJeux, state.reservationsJeux.length, reservationJeu);
    },
    SET_RESERVATIONS(state, reservations) {
      state.reservations = reservations;
    },
    SET_RESERVATIONS_JEUX(state, reservationJeu) {
      state.reservationsJeux = reservationJeu;
    },
    SET_SOUVENIR(state, souvenirs) {
      state.souvenirs = souvenirs;
    },
    SET_USER_ORDERS(state, orders) {
      state.userOrders = orders;
    },
    SET_CURRENT_ORDER(state, order) {
      state.currentOrder = order;
    },
    RESET_CURRENT_ORDER(state, Order) {
      state.currentOrder = Order;
    },
    SET_STANDS(state, stands) {
      state.stands = stands;
    },
    SET_COMMANDES(state, commandes) {
      state.commandes = commandes;
    },
  },
  actions: {
    async getAllTournois({ commit }) {
      try {
        const response = await getAllTournois();
        console.log('Tournois récupérés :', response.data);
        if (response.error === 0) {
          commit('SET_TOURNOIS', response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des tournois :", error);
      }
    },
    async getAllJeux({ commit }) {
      try {
        const response = await getAllJeux();
        console.log('Jeux récupérés :', response.data);
        if (response.error === 0) {
          commit('SET_JEUX', response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des jeux :", error);
      }
    },
    fetchUserReservations({ commit }, userId) {
      const userReservations = reservations.filter(reservation => reservation.userId === userId);
      commit('SET_RESERVATIONS', userReservations);
    },
    fetchUserReservationsJeux({ commit }, userId) {
      const userReservationsJeux = reservationsJeux.filter(reservationJeu => reservationJeu.userId === userId);
      commit('SET_RESERVATIONS_JEUX', userReservationsJeux);
    },
    async fetchAllOrders({ commit }) {
      try {
        commit('SET_COMMANDES', commandes);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes :', error);
      }
    },
    setUserSession({ commit }, user) {
      commit('SET_USER_SESSION', user);
    },
    clearUserSession({ commit }) {
      commit('CLEAR_USER_SESSION');
    },
    addCompte({ commit }, compte) {
      commit('ADD_COMPTE', compte);
    },
    addReservation({ commit }, reservation) {
      commit('ADD_RESERVATION', reservation);
    },
    addReservationJeux({ commit }, reservationJeu) {
      commit('ADD_RESERVATION_JEUX', reservationJeu);
    },
    addArticleOrder({ commit, state }, order) {
      const updatedOrders = [...state.userOrders, order];
      commit('SET_USER_ORDERS', updatedOrders);
      console.log("Commandes d'articles actuelles :", updatedOrders);
    },
    setCurrentOrder({ commit }, order) {
      commit('SET_CURRENT_ORDER', order);  // Met à jour la commande en cours
    },
    resetCurrentOrder({ commit }) {
      commit('RESET_CURRENT_ORDER');  // Réinitialise la commande en cours
    },
    async getAllSouvenirs({ commit }) {
      try {
        const response = await getAllSouvenirs();
        console.log('Souvenirs récupérés :', response.data);
        if (response.error === 0) {
          commit('SET_SOUVENIR', response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des souvenirs :", error);
      }
    },
    async getAllStands({ commit }) {
      try {
        const response = await getAllStands();
        console.log('Stands récupérés :', response.data);
        if (response.error === 0) {
          commit('SET_STANDS', response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des stands :", error);
      }
    },
  },
  getters: {
    tournois: (state) => state.tournois,
    jeux: (state) => state.jeux,
    stands: (state) => state.stands,
    comptes: (state) => state.comptes,
    userSession: (state) => state.userSession,
    souvenirs: (state) => state.souvenirs,
    userOrders: (state) => {
      console.log('User orders:', state.userOrders);  // Vérifie les données
      if (state.userSession) {
        return state.userOrders.filter(
            (order => order.userId === state.userSession.id)
        );
      }
      return [];
    },
    currentOrder : (state) => state.currentOrder,
    allOrders(state) {
      return state.userOrders || [];
    },
    userReservations: (state) => {
      console.log("Reservations in state:", state.reservations);
      if (state.userSession) {
        return state.reservations.filter(
            (reservation) => reservation.userId === state.userSession.id
        );
      }
      return [];
    },
    userReservationsJeux: (state) => {
      console.log("ReservationsJeu in state:", state.reservationsJeux);
      if (state.userSession) {
        return state.reservationsJeux.filter(
            (reservationJeu) => reservationJeu.userId === state.userSession.id
        );
      }
      return [];
    },
  },
});