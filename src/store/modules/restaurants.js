import Vue from "vue";
import { stands } from "@/datasource/stands.js";

export default {
  namespaced: true,
  state: {
    restaurants: [],
    allStands: []
  },
  mutations: {
    SET_RESTAURANTS(state, restaurants) {
      state.restaurants = restaurants;
    },
    SET_ALL_STANDS(state, stands) {
      state.allStands = stands;
    },
    ADD_RESTAURANT(state, restaurant) {
      state.restaurants.push(restaurant);
      state.allStands.push(restaurant);
    },
    ADD_STAND(state, stand) {
      state.allStands.push(stand);
    },
    UPDATE_RESTAURANT(state, updatedRestaurant) {
      const updateInArray = (array) => {
        const index = array.findIndex(r => r.id === updatedRestaurant.id);
        if (index !== -1) Vue.set(array, index, updatedRestaurant);
      };
      updateInArray(state.restaurants);
      updateInArray(state.allStands);
    },
    UPDATE_STAND(state, updatedStand) {
      const index = state.allStands.findIndex(s => s.id === updatedStand.id);
      if (index !== -1) {
        Vue.set(state.allStands, index, updatedStand);
        
        // Si c'est aussi un restaurant, mettre à jour le tableau restaurants
        if (updatedStand.type === "restaurants") {
          const restIndex = state.restaurants.findIndex(r => r.id === updatedStand.id);
          if (restIndex !== -1) {
            Vue.set(state.restaurants, restIndex, updatedStand);
          }
        }
      }
    }
  },
  actions: {
    async initializeRestaurants({ commit }) {
      try {
        const restaurantStands = stands.filter(stand => stand.type === "restaurants");
        commit("SET_RESTAURANTS", restaurantStands);
        commit("SET_ALL_STANDS", stands);
      } catch (error) {
        console.error("Erreur initialisation restaurants:", error);
      }
    },
    async addRestaurant({ commit }, restaurantData) {
      const newRestaurant = {
        ...restaurantData,
        id: `restaurant-${Date.now()}`,
        type: "restaurants",
        notes: [],
        commentaires: [],
        nourritures: restaurantData.nourritures || [],
        boissons: restaurantData.boissons || []
      };
      commit("ADD_RESTAURANT", newRestaurant);
      return newRestaurant;
    },
    async addStand({ commit }, standData) {
      const newStand = {
        ...standData,
        id: `stand-${Date.now()}`,
        notes: [],
        commentaires: []
      };
      commit("ADD_STAND", newStand);
      return newStand;
    },
    async updateRestaurant({ commit }, restaurant) {
      commit("UPDATE_RESTAURANT", restaurant);
    },
    async updateStand({ commit }, stand) {
      commit("UPDATE_STAND", stand);
    },
    async saveStand({ commit, state }, standData) {
      return new Promise((resolve, reject) => {
        try {
          // Vérifier si l'utilisateur a déjà un stand
          const existingStand = state.allStands.find(s => 
            s.comptes && s.comptes.includes(standData.comptes[0])
          );
    
          const standToSave = {
            ...standData,
            id: existingStand ? existingStand.id : `stand-${Date.now()}`,
            type: standData.type || "stand" // valeur par défaut
          };
    
          if (existingStand) {
            commit("UPDATE_STAND", standToSave);
          } else {
            commit("ADD_STAND", standToSave);
          }
    
          console.log("Stand sauvegardé:", standToSave); // Debug
          resolve(standToSave);
        } catch (error) {
          console.error("Erreur saveStand:", error); // Debug
          reject(error);
        }
      });
    }
  },
  getters: {
    restaurants: state => state.restaurants,
    allStands: state => state.allStands,
    restaurantByUser: (state) => (userId) => {
      return state.restaurants.find(restaurant => 
        restaurant.comptes && restaurant.comptes.includes(userId)
      );
    },
    standByUser: (state) => (userId) => {
      return state.allStands.find(stand => 
        stand.comptes && stand.comptes.includes(userId)
      );
    },
    getStandById: (state) => (id) => {
      return state.allStands.find(stand => stand.id === id);
    },
    // Helper pour déterminer le type de stand en fonction du rôle utilisateur
    getStandType: (state, getters, rootState, rootGetters) => (userId) => {
      const user = rootGetters['user/comptes'].find(c => c.id === userId);
      if (!user) return 'autre';
      
      const roleMap = {
        createur: "stand de jeux",
        restaurateur: "restaurant",
        vendeur: "boutique",
        organisateur: "tournois"
      };
      
      return roleMap[user.role] || "autre";
    }
  }
};