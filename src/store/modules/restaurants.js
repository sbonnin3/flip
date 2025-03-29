import Vue from "vue"; // Ajout de l'import
import { stands } from "@/datasource/stands.js";

export default {
  namespaced: true,
  state: {
    restaurants: [],
  },
  mutations: {
    SET_RESTAURANTS(state, restaurants) {
      state.restaurants = restaurants;
    },
    ADD_RESTAURANT(state, restaurant) {
      state.restaurants.push(restaurant);
    },
    UPDATE_RESTAURANT(state, updatedRestaurant) {
      const index = state.restaurants.findIndex(r => r.id === updatedRestaurant.id);
      if (index !== -1) {
        Vue.set(state.restaurants, index, updatedRestaurant); // Vue.set pour la réactivité
      }
    },
  },
  actions: {
    initializeRestaurants({ commit }) {
      console.log("Initialisation des restaurants...");
      commit("SET_RESTAURANTS", stands);
    },
    addRestaurant({ commit }, restaurant) {
      commit("ADD_RESTAURANT", restaurant);
    },
    updateRestaurant({ commit }, restaurant) {
      commit("UPDATE_RESTAURANT", restaurant);
    },
  },
  getters: {
    restaurants: (state) => state.restaurants,
  },
};
