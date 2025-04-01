import { jeux } from "@/datasource/data";
import { getAllJeux } from "@/services/jeuxService";

const state = {
  jeux: jeux
};

const mutations = {
  SET_JEUX(state, jeux) {
    state.jeux = jeux;
  }
};

const actions = {
  async getAllJeux({ commit }) {
    try {
      const response = await getAllJeux();
      if (response.error === 0) {
        commit('SET_JEUX', response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des jeux:", error);
    }
  }
};

const getters = {
  jeux: state => state.jeux
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};