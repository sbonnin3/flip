export default {
  namespaced: true,
  state: {
    jeux: []
  },
  mutations: {
    SET_JEUX(state, jeux) {
      state.jeux = jeux;
    },
    ADD_JEUX(state, jeux) {
      state.jeux.push(jeux);
    }
  },
  actions: {
    async getAllJeux({ commit }) {
      try {
        const jeux = require("@/datasource/data").jeux;
        commit('SET_JEUX', jeux);
      } catch (error) {
        console.error("Erreur lors de la récupération des jeux :", error);
      }
    }
  }
};
