export default {
  namespaced: true,
  state: {
    tournois: require("@/datasource/data").tournois, // Charge les données initiales
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
      async fetchTournois({ commit }) {
        try {
          const { tournois } = await import("@/datasource/tournois");
          commit("SET_TOURNOIS", tournois);
        } catch (error) {
          console.error("Erreur chargement tournois:", error);
        }
      },
      async addTournoi({ commit }, tournoi) {
        commit("ADD_TOURNOI", {
          ...tournoi,
          _id: Date.now().toString()
        });
      }
    },
    getters: {
      tournoisByUser: (state) => (userId) => {
        return state.tournois.filter(t => t.prestataireId === userId);
      }
    }
  };