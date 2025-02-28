import Vue from 'vue';
import Vuex from 'vuex';
import {
  commandes,
  reservations,
  reservationsJeux,
  comptes,
  reservationStandJeu,
  stands,
  jeux,
  tournois, souvenirs
} from "@/datasource/data";
import { getAllJeux } from "@/services/jeuxService";
import { getAllSouvenirs } from "@/services/souvenirsService";
import { getAllStands } from "@/services/standsService";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    tournois: tournois,
    jeux: jeux,
    comptes: comptes,
    restaurants: [], // Charger les restaurants qu'un "restaurateur" créera
    userSession: null, // L'utilisateur n'est pas connecté en venant sur le site
    souvenirs: souvenirs,
    reservations: reservations,
    reservationsJeux: reservationsJeux,
    reservationStand: reservationStandJeu,
    userOrders: commandes, // Charger les commandes de l'utilisateur
    currentOrder: [], // Une "sauvegarde" de la commande en cours de l'utilisateur
    stands: stands,
  },
  mutations: {
    UPDATE_RESTAURANT(state, updatedRestaurant) {
      const index = state.restaurants.findIndex((restau) => restau.id === updatedRestaurant.id);
      if (index !== -1) {
        state.restaurants[index] = { ...updatedRestaurant };
      }
    },
    ADD_RESTAURANT(state, restaurant) {
      state.restaurants.push(restaurant);
    },
    UPDATE_POINT_AVAILABILITY(state, { idPoint, disponible }) {
      const point = state.points.find((p) => p.idPoint === idPoint);
      if (point) {
        point.disponible = disponible;
      }
    },
    SET_RESTAURANTS(state, restaurants) {
      state.restaurants = restaurants;
    },
    SET_USER_SESSION(state, session) {
      state.userSession = session;
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
      console.log("Tournois enregistrés dans le store :", tournois);
      state.tournois = tournois;
    },
    SET_JEUX(state, jeux) {
      state.jeux = jeux;
    },
    CLEAR_USER_SESSION(state) {
      state.userSession = null;
    },
    ADD_COMPTE(state, nouveauCompte) {
      state.comptes.push(nouveauCompte);
    },
    ADD_TO_CART(state, article) {
      const itemInCart = state.cart.find(item => item.nom === article.nom);
      if (itemInCart) {
        itemInCart.quantite += 1;
      } else {
        state.cart.push({ ...article, quantite: 1 });
      }
    },
    ADD_TOURNOI(state, tournoi) {
      console.log("Ajout du tournoi :", tournoi);
      state.tournois.push(tournoi);
    },
    ADD_RESERVATION(state, reservation) {
      state.reservations.push(reservation);
    },
    ADD_RESERVATION_JEUX(state, reservationJeu) {
      Vue.set(state.reservationsJeux, state.reservationsJeux.length, reservationJeu);
    },
    SET_RESERVATIONS(state, reservations) {
      state.reservations = reservations;
    },
    SET_RESERVATIONS_JEUX(state, reservationJeu) {
      state.reservationsJeux = reservationJeu;
    },
    SET_RESERVATIONS_STANDJEU(state, reservationStandJeu) {
      state.reservationStand = reservationStandJeu;
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
    addRestaurant({ commit }, restaurant) {
      commit("ADD_RESTAURANT", restaurant);
      commit("UPDATE_POINT_AVAILABILITY", { idPoint: restaurant.idPoint, disponible: false });
    },
    updateRestaurant({ commit, state }, updatedRestaurant) {
      commit("UPDATE_RESTAURANT", updatedRestaurant);
      localStorage.setItem("stands", JSON.stringify(state.restaurants));
    },
    createRestaurant({ commit }, restaurantData) {
      console.log("Création d'un restaurant dans le store avec : ", restaurantData);
      const newRestaurant = {
        ...restaurantData,
        id: Date.now(),
        type: "restaurants",
        comptes: [restaurantData.userId],
      };
      commit("ADD_RESTAURANT", newRestaurant);
    },
    initializeStore({ commit }) {
      const { stands } = require("@/datasource/stands.js");
      commit("SET_RESTAURANTS", stands);
    },
    initializeRestaurants({ commit }) {
      try {
        const restaurants = require('@/datasource/stands.js').stands;
        commit('SET_RESTAURANTS', restaurants);
      } catch (error) {
        console.error("Erreur lors de l'initialisation des restaurants :", error);
      }
    },
    async fetchTournoisByPrestataire({ commit, state }) {
      if (!state.userSession) return;
      const prestataireId = state.userSession.id;
      const tournoisForPrestataire = state.tournois.filter(
        (tournoi) => tournoi.prestataireId === prestataireId
      );
      commit('SET_TOURNOIS', tournoisForPrestataire);
    },
    loadRestaurants({ commit }) {
      const restaurants = require('@/datasource/stands.js').stands;
      commit('SET_RESTAURANTS', restaurants);
    },
    async setUserSession({ commit, dispatch }, user) {
      commit("SET_USER_SESSION", user);
      await dispatch("fetchTournoisByPrestataire");
    },
    async getAllTournois({ commit }) {
      try {
        const tournois = require("@/datasource/data").tournois;
        commit("SET_TOURNOIS", tournois);
      } catch (error) {
        console.error("Erreur lors de la récupération des tournois :", error);
      }
    },
    fetchReservationsByPrestataire({ commit, state }, prestataireId) {
      const reservationsForPrestataire = state.reservations.filter(
        (reservation) => {
          const tournoi = state.tournois.find(t => t.id === reservation.tournoiId);
          return tournoi && tournoi.prestataireId === prestataireId;
        }
      );
      commit('SET_RESERVATIONS', reservationsForPrestataire);
    },
    addReservation({ commit }, reservation) {
      commit('ADD_RESERVATION', reservation);
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
    fetchUserReservationsStandJeu({ commit }, userId) {
      const userReservationsStandJeu = reservationStandJeu.filter(reservationStandJeu => reservationStandJeu.userId === userId);
      commit('SET_RESERVATIONS_STANDJEU', userReservationsStandJeu);
    },
    async fetchAllOrders({ commit }) {
      try {
        commit('SET_COMMANDES', commandes);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes :', error);
      }
    },
    async fetchAllSells({ commit }) {
      try {
        commit('SET_RESERVATIONS_JEUX', reservationsJeux);
      } catch (error) {
        console.error('Erreur lors de la récupération des ventes :', error);
      }
    },
    async fetchAllReservationsStand({ commit }) {
      try {
        commit('SET_RESERVATIONS_STANDJEU', reservationStandJeu);
      } catch (error) {
        console.error('Erreur lors de la récupération des reservations :', error);
      }
    },
    clearUserSession({ commit }) {
      commit('CLEAR_USER_SESSION');
    },
    addCompte({ commit }, compte) {
      commit('ADD_COMPTE', compte);
    },
    addReservationJeux({ commit }, reservationJeu) {
      commit('ADD_RESERVATION_JEUX', reservationJeu);
    },
    addReservationStandJeu({ commit }, reservationsStandJeu) {
      commit('ADD_RESERVATION_STANDJEU', reservationsStandJeu);
    },
    addArticleOrder({ commit, state }, order) {
      const updatedOrders = [...state.userOrders, order];
      commit('SET_USER_ORDERS', updatedOrders);
      console.log("Commandes d'articles actuelles :", updatedOrders);
    },
    setCurrentOrder({ commit }, order) {
      commit('SET_CURRENT_ORDER', order);
    },
    resetCurrentOrder({ commit }) {
      commit('RESET_CURRENT_ORDER');
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
    getUserRole: (state) => (userId) => {
      console.log("Recherche du rôle pour l'utilisateur ID :", userId);
      const compte = state.comptes.find((compte) => compte.id === userId);
      console.log("Compte trouvé :", compte);
      return compte ? compte.role : null;
    },
    restaurantByUser: (state) => (userId) => {
      return state.restaurants.find((restaurant) =>
        restaurant.comptes.includes(userId)
      );
    },
    tournois: (state) => state.tournois,
    jeux: (state) => state.jeux,
    stands: (state) => state.stands,
    comptes: (state) => state.comptes,
    restaurants: (state) => state.restaurants,
    userSession: (state) => state.userSession,
    souvenirs: (state) => state.souvenirs,
    reservationsByPrestataire: (state) => (prestataireId) => {
      const tournoisIds = state.tournois
        .filter(tournoi => tournoi.prestataireId === prestataireId)
        .map(tournoi => tournoi._id);
      console.log("IDs des tournois du prestataire :", tournoisIds);
      const reservations = state.reservations.filter(
        reservation => tournoisIds.includes(reservation.tournoiId)
      );
      console.log("Réservations trouvées :", reservations);
      return reservations;
    },
    userOrders: (state) => {
      console.log('User orders:', state.userOrders);
      if (state.userSession) {
        return state.userOrders.filter(
          (order => order.userId === state.userSession.id)
        );
      }
      return [];
    },
    currentOrder: (state) => state.currentOrder,
    allOrders(state) {
      return state.userOrders || [];
    },
    allSells(state) {
      return state.reservationsJeux || [];
    },
    allReservationsStand(state) {
      return state.reservationStand || [];
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
    userReservationsStandJeu: (state) => {
      console.log("ReservationsStandJeu in state:", state.reservationStand);
      if (state.userSession) {
        return state.reservationStand.filter(
          (reservationStandJeu) => reservationStandJeu.userId === state.userSession.id
        );
      }
      return [];
    },
  },
});