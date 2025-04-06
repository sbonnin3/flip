import { getArticleService } from "@/services/serviceapi/article";

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
        const response = await getArticleService();
          commit('SET_SOUVENIRS', response);
      } catch (error) {
        console.error("Erreur lors de la récupération des souvenirs :", error);
      }
    }
  }
};
