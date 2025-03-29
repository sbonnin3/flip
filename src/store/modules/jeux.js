import { getAllJeux } from "@/services/jeuxService";

export default {
  namespaced: true,
  state: {
    jeux: []
  },
  mutations: {
    SET_JEUX(state, jeux) {
      state.jeux = jeux;
    }
  },
  actions: {
    async getAllJeux({ commit }) {
      try {
        const response = await getAllJeux();
        if (response.error === 0) {
          commit('SET_JEUX', response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des jeux :", error);
      }
    }
  }
};
