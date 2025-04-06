import { getArticleService } from "@/services/serviceapi/article";

export default {
    namespaced: true,
    state: {
        produits: []
    },
    mutations: {
        SET_PRODUITS(state, produits) {
            state.produits = produits;
        }
    },
    actions: {
        async getAllProduits({ commit }) {
            try {
                const produits = await getArticleService();
                console.log("enieme test:" + JSON.stringify(produits))
                commit('SET_PRODUITS', produits);
            } catch (error) {
                console.error("Error fetching produits:", error);
            }
        }
    },
    getters: {
        allProduits: (state) => state.produits
    }
};