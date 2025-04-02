export default {
  namespaced: true,
  state: {
    jeux: require("@/datasource/data").jeux,
    jeuxCreation: []
  },
  mutations: {
    SET_JEUX(state, jeux) {
      state.jeux = jeux;
    },
    SET_JEUX_CREATION(state, jeuxCreation) {
      state.jeuxCreation = jeuxCreation;
    },
    ADD_JEUX(state, jeux) {
      state.jeux.push(jeux);
    }
  },
  actions: {
    async fetchJeuxCreation({ commit }) {
      try {
        const jeuxCreation = require("@/datasource/data").jeuxCreation;
        commit('SET_JEUX_CREATION', jeuxCreation);
        return jeuxCreation;
      } catch (error) {
        console.error("Error loading jeuxCreation:", error);
        return [];
      }
    },
    async getAllJeux({ commit }) {
      try {
        // Simule un rechargement depuis la source
        const jeux = require("@/datasource/data").jeux; 
        commit('SET_JEUX', jeux);
        return jeux;
      } catch (error) {
        console.error("Erreur chargement jeux:", error);
        return [];
      }
    }
  },
  getters: {
    allJeux: (state) => state.jeux || [],
    jeuxCreation: (state) => state.jeuxCreation || []
  }
};
