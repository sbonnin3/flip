import Vue from 'vue';
import Vuex from 'vuex';
import { reservations } from "@/datasource/data";
import { getAllTournois } from '@/services/tournoisService';
import { comptes } from '@/datasource/comptes';
import { getAllSouvenirs } from "@/services/souvenirsService";
import { getAllStands } from "@/services/standsService";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tournois: [],
    comptes: comptes,
    userSession: null,
    souvenirs: [],
    reservations: reservations,
    userOrders: [],
    restaurants: [],
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
    CLEAR_USER_SESSION(state) {
      state.userSession = null;
    },
    ADD_COMPTE(state, nouveauCompte) {
      state.comptes.push(nouveauCompte);
    },
    ADD_RESERVATION(state, reservation) {
      Vue.set(state.reservations, state.reservations.length, reservation);
    },
    SET_RESERVATIONS(state, reservations) {
      state.reservations = reservations;
    },
    SET_SOUVENIR(state, souvenirs) {
      state.souvenirs = souvenirs;
    },
    SET_USER_ORDERS(state, orders) {
      state.userOrders = orders;
    },
    SET_STANDS(state, restaurants) {
      state.restaurants = restaurants;
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
    fetchUserReservations({ commit }, userId) {
      const userReservations = reservations.filter(reservation => reservation.userId === userId);
      commit('SET_RESERVATIONS', userReservations);
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
    addArticleOrder({ commit, state }, order) {
      const updatedOrders = [...state.userOrders, order];
      commit('SET_USER_ORDERS', updatedOrders);
      console.log("Commandes d'articles actuelles :", updatedOrders);
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
    comptes: (state) => state.comptes,
    userSession: (state) => state.userSession,
    souvenirs: (state) => state.souvenirs,
    userOrders: (state) => state.userOrders,
    restaurants: (state) => state.restaurants,
    userReservations: (state) => {
      console.log("Reservations in state:", state.reservations);
      if (state.userSession) {
        return state.reservations.filter(
            (reservation) => reservation.userId === state.userSession.id
        );
      }
      return [];
    },
  },
});