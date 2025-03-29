import { getAllStands } from "@/services/standsService";

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
        const response = await getAllStands();
        if (response.error === 0) {
          commit('SET_STANDS', response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des stands :", error);
      }
    }
  }
};
