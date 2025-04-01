import { stands } from "@/datasource/stands";

const state = {
  restaurants: []
};

const mutations = {
  INIT_RESTAURANTS(state) {
    state.restaurants = stands;
  },
  UPDATE_RESTAURANT(state, updatedRestaurant) {
    const index = state.restaurants.findIndex(r => r.id === updatedRestaurant.id);
    if (index !== -1) {
      state.restaurants[index] = { ...updatedRestaurant };
    }
  },
  ADD_RESTAURANT(state, restaurant) {
    state.restaurants.push(restaurant);
  },
  SET_RESTAURANTS(state, restaurants) {
    state.restaurants = restaurants;
  }
};

const actions = {
  initializeRestaurants({ commit }) {
    commit('INIT_RESTAURANTS');
  },
  addRestaurant({ commit }, restaurant) {
    commit("ADD_RESTAURANT", restaurant);
  },
  updateRestaurant({ commit }, updatedRestaurant) {
    commit("UPDATE_RESTAURANT", updatedRestaurant);
  },
  loadRestaurants({ commit }) {
    commit('SET_RESTAURANTS', stands);
  }
};

const getters = {
  restaurants: state => state.restaurants || [],
  restaurantByUser: (state) => (userId) => {
    return state.restaurants.find(r => r.comptes && r.comptes.includes(userId));
  }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  };