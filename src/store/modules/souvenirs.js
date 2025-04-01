import { souvenirs } from "@/datasource/data";
import { getAllSouvenirs } from "@/services/souvenirsService";

const state = {
  souvenirs: souvenirs
};

const mutations = {
  SET_SOUVENIR(state, souvenirs) {
    state.souvenirs = souvenirs;
  }
};

const actions = {
  async getAllSouvenirs({ commit }) {
    try {
      const response = await getAllSouvenirs();
      if (response.error === 0) {
        commit('SET_SOUVENIR', response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des souvenirs:", error);
    }
  }
};

const getters = {
  souvenirs: state => state.souvenirs
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};