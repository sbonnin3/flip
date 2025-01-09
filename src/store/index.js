import Vue from 'vue';
import Vuex from 'vuex';
import { commandes, reservations, reservationsJeux, comptes, reservationStandJeu} from "@/datasource/data";
import { getAllJeux } from "@/services/jeuxService";
import { getAllSouvenirs } from "@/services/souvenirsService";
import { getAllStands } from "@/services/standsService";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    tournois: [],
    jeux: [],
    comptes: comptes,
    restaurants: [], // Charge les restaurants au démarrage
    userSession: null,
    souvenirs: [],
    reservations: reservations,
    reservationsJeux: reservationsJeux,
    reservationStand: reservationStandJeu,
    userOrders: commandes,
    currentOrder: [],
    stands: [],
  },
  mutations: {
    UPDATE_RESTAURANT(state, updatedRestaurant) {
      const index = state.restaurants.findIndex((restau) => restau.id === updatedRestaurant.id);
      if (index !== -1) {
        state.restaurants[index] = { ...updatedRestaurant };
      }
    },
    ADD_RESTAURANT(state, restaurant) {
      state.restaurants = [...state.restaurants, restaurant]; // Ajouter de manière immuable
      console.log("Restaurant ajouté :", restaurant);
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
      console.log("Tournois enregistrés dans le store :", tournois); // Vérifiez ici
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
      console.log("Tournoi ajouté au store :", tournoi);
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
    SET_RESERVATIONS_STANDJEU(state, reservationStandJeu){
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
    updateRestaurant({ commit, state }, updatedRestaurant) {
      commit("UPDATE_RESTAURANT", updatedRestaurant);
      localStorage.setItem("stands", JSON.stringify(state.restaurants)); // Sauvegarde des restaurants modifiés
    },      
    createRestaurant({ commit }, restaurantData) {
      console.log("Création d'un restaurant dans le store avec : ", restaurantData);
      const newRestaurant = {
        ...restaurantData,
        id: Date.now(), // ID unique pour le restaurant
        type: "restaurants", // Type de l'objet
        comptes: [restaurantData.userId], // Associer l'utilisateur
      };
  
      // Ajouter le restaurant dans le store
      commit("ADD_RESTAURANT", newRestaurant);
    },
    async initializeStore({ commit }) {
      try {
        // Charger les restaurants depuis localStorage ou initialiser un tableau vide
        let stands = [];
        const storedStands = localStorage.getItem("stands");
    
        if (storedStands) {
          try {
            stands = JSON.parse(storedStands);
          } catch (parseError) {
            console.error("Erreur lors de l'analyse JSON du localStorage. Réinitialisation des stands.", parseError);
            stands = [];
          }
        }
    
        // Si aucun stand n'est trouvé, charger depuis le fichier stands.js
        if (!stands.length) {
          const { stands: defaultStands } = require("@/datasource/stands.js");
          stands = defaultStands;
    
          // Sauvegarder les stands par défaut dans localStorage
          localStorage.setItem("stands", JSON.stringify(stands));
        }
    
        // Assurer que chaque stand a les champs essentiels
        stands = stands.map((stand) => ({
          ...stand,
          nourritures: stand.nourritures || [],
          boissons: stand.boissons || [],
          notes: stand.notes || [],
          commentaires: stand.commentaires || [],
        }));
    
        // Commit des stands au store
        commit("SET_RESTAURANTS", stands);
      } catch (error) {
        console.error("Erreur lors de l'initialisation des restaurants :", error);
      }
    },    
    async fetchTournoisByPrestataire({ commit, state }) {
      if (!state.userSession) return;
      const prestataireId = state.userSession.id;
      // Filtrer les tournois par l'ID du prestataire
      const tournoisForPrestataire = state.tournois.filter(
        (tournoi) => tournoi.prestataireId === prestataireId
      );
      // Committer les tournois pour le prestataire
      commit('SET_TOURNOIS', tournoisForPrestataire);
    },
    loadRestaurants({ commit }) {
      const restaurants = require('@/datasource/stands.js').stands; // Charge depuis stands.js
      commit('SET_RESTAURANTS', restaurants);
    },
    async setUserSession({ commit, dispatch }, user) {
      commit("SET_USER_SESSION", user);
      await dispatch("fetchTournoisByPrestataire");
    },
    async getAllTournois({ commit }) {
      try {
        // Simuler une récupération de tournois
        const tournois = require("@/datasource/data").tournois;
        commit("SET_TOURNOIS", tournois);
      } catch (error) {
        console.error("Erreur lors de la récupération des tournois :", error);
      }
    },
    fetchReservationsByPrestataire({ commit, state }, prestataireId) {
      // Filtrer les réservations pour les tournois créés par le prestataire
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
    addReservationStandJeu({ commit }, reservationsStandJeu){
      commit('ADD_RESERVATION_STANDJEU', reservationsStandJeu);
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
        .filter(tournoi => tournoi.prestataireId === prestataireId) // Filtrer les tournois par prestataire
        .map(tournoi => tournoi._id); // Récupérer les IDs des tournois
      console.log("IDs des tournois du prestataire :", tournoisIds); // Ajoutez ce log
      const reservations = state.reservations.filter(
        reservation => tournoisIds.includes(reservation.tournoiId)
      );
      console.log("Réservations trouvées :", reservations); // Ajoutez ce log
      return reservations;
    },
    userOrders: (state) => {
      console.log('User orders:', state.userOrders);  // Vérifie les données
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
    allSells(state){
      return state.reservationsJeux || [];
    },
    allReservationsStand(state){
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