export default {
    namespaced: true,
    state: {
      tournois: []
    },
    mutations: {
      SET_TOURNOIS(state, tournois) {
        state.tournois = tournois;
      },
      ADD_TOURNOI(state, tournoi) {
        state.tournois.push(tournoi);
      }
    },
    actions: {
      async getAllTournois({ commit }) {
        try {
          const tournois = require("@/datasource/data").tournois;
          commit('SET_TOURNOIS', tournois);
        } catch (error) {
          console.error("Erreur lors de la récupération des tournois :", error);
        }
      }
    }
  };
  