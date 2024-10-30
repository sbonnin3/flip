import Vue from 'vue';
import Vuex from 'vuex';
import { reservations } from "@/datasource/data";
import { getAllTournois } from '@/services/tournoisService';
import { comptes } from '@/datasource/comptes';
import { getAllSouvenirs } from "@/services/souvenirsService";
import { getAllNourritures } from "@/services/nourrituresService";
import { getAllRestaurant } from "@/services/restaurantsService";
import { getAllBoissons } from "@/services/boissonsService";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tournois: [],
    comptes: comptes,
    userSession: null,
    souvenirs: [],
    nourritures: [],
    restaurants: [],
    boissons: [],
    reservations: reservations,
    userOrders: [],
  },
  mutations: {
    SET_TOURNOIS(state, tournois) {
      state.tournois = tournois;
    },
    SET_USER_SESSION(state, user) {
      state.userSession = user;
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
    SET_NOURRITURE(state, nourritures) {
      state.nourritures = nourritures;
    },
    SET_RESTAURANT(state, restaurants) {
      state.restaurants = restaurants;
    },
    SET_BOISSON(state, boissons) {
      state.boissons = boissons;
    },
    SET_USER_ORDERS(state, orders) {
      state.userOrders = orders;
    }
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
      this.$forceUpdate();
    },
    addArticleOrder({ commit, state}, order) {
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
    async getAllNourritures({ commit }) {
      try {
        const response = await getAllNourritures();
        console.log('Nourriture récupérée :', response.data);
        if (response.error === 0) {
          commit('SET_NOURRITURE', response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la nourriture :", error);
      }
    },
    async getAllRestaurant({ commit }) {
      try {
        const response = await getAllRestaurant();
        console.log('Restaurants récupérés :', response.data);
        if (response.error === 0) {
          commit('SET_RESTAURANT', response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des restaurants :", error);
      }
    },
    async getAllBoissons({ commit }) {
      try {
        const response = await getAllBoissons();
        console.log('Boissons récupérées :', response.data);
        if (response.error === 0) {
          commit('SET_BOISSON', response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des boissons :", error);
      }
    },
  },
  getters: {
    tournois: (state) => state.tournois,
    comptes: (state) => state.comptes,
    userSession: (state) => state.userSession,
    souvenirs: (state) => state.souvenirs,
    nourritures: (state) => state.nourritures,
    restaurants: (state) => state.restaurants,
    boissons: (state) => state.boissons,
    userOrders: (state) => state.userOrders,
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