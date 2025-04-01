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
    UPDATE_RESTAURANT(state, updatedRestaurant) {
      const updateInArray = (array) => {
        const index = array.findIndex(r => r.id === updatedRestaurant.id);
        if (index !== -1) Vue.set(array, index, updatedRestaurant);
      };
      updateInArray(state.restaurants);
      updateInArray(state.allStands);
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
        id: Date.now(),
        type: "restaurants",
        notes: [],
        commentaires: []
      };
      commit("ADD_RESTAURANT", newRestaurant);
      return newRestaurant;
    },
    async updateRestaurant({ commit }, restaurant) {
      commit("UPDATE_RESTAURANT", restaurant);
    }
  },
  getters: {
    restaurants: state => state.restaurants,
    allStands: state => state.allStands,
    restaurantByUser: (state) => (userId) => {
      return state.restaurants.find(restaurant => 
        restaurant.comptes.includes(userId)
      );
    },
    standByUser: (state) => (userId) => {
      return state.allStands.find(stand => stand.comptes.includes(userId))
    }
  }
};