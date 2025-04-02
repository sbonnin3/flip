export default {
  namespaced: true,
  state: {
      stands: []
  },
  mutations: {
      SET_STANDS(state, stands) {
          state.stands = stands.map(stand => ({
              ...stand,
              idStand: stand.idStand || `stand-${Math.random().toString(36).substr(2, 9)}`
          }));
      }
  },
  actions: {
      async getAllStands({ commit }) {
          try {
              const { stands } = require("@/datasource/data");
              commit('SET_STANDS', stands);
          } catch (error) {
              console.error("Erreur lors de la récupération des stands :", error);
          }
      }
  },
  getters: {
      stands: state => state.stands || [],
      getStandById: (state) => (id) => {
          return state.stands.find(stand => stand.idStand === id);
      }
  }
};