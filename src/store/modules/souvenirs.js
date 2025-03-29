import { getAllSouvenirs } from "@/services/souvenirsService";

export default {
  namespaced: true,
  state: {
    souvenirs: []
  },
  mutations: {
    SET_SOUVENIRS(state, souvenirs) {
      state.souvenirs = souvenirs;
    }
  },
  actions: {
    async getAllSouvenirs({ commit }) {
      try {
        const response = await getAllSouvenirs();
        if (response.error === 0) {
          commit('SET_SOUVENIRS', response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des souvenirs :", error);
      }
    }
  }
};
