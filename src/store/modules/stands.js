export default {
  namespaced: true,
  state: {
    stands: []
  },
  mutations: {
    SET_STANDS(state, stands) {
      state.stands = stands;
    }
  },
  actions: {
    async getAllStands({ commit }) {
      try {
        const stands = require("@/datasource/data").stands;
        commit('SET_STANDS', stands);
      } catch (error) {
        console.error("Erreur lors de la récupération des stands :", error);
      }
    }
  },
  // AJOUT CRITIQUE
  getters: {
    getStandByUserId: (state) => (userId) => {
      return state.stands.find(stand => 
        stand.comptes?.includes(userId)
      ) || null; // Fallback explicite
    }
  }
};