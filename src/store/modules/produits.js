import { getArticleService, updateArticleService } from "@/services/serviceapi/article";

export default {
    namespaced: true,
    state: {
        produits: []
    },
    mutations: {
        SET_PRODUITS(state, produits) {
            state.produits = produits;
        },
        UPDATE_PRODUIT(state, updatedProduit) {
            const index = state.produits.findIndex(p => p.id === updatedProduit.id);
            if (index !== -1) {
                state.produits.splice(index, 1, updatedProduit);
            }
        }
    },
    actions: {
        async getAllProduits({ commit }) {
            try {
                const produits = await getArticleService();
                commit('SET_PRODUITS', produits);
            } catch (error) {
                console.error("Error fetching produits:", error);
            }
        },
        async updateProduit({ commit }, { id, data }) {
            try {
                const updatedProduit = await updateArticleService(id, data);
                console.log("Produit updated successfully:", updatedProduit);
                commit('UPDATE_PRODUIT', updatedProduit);
                return updatedProduit;
            } catch (error) {
                console.error("Error updating produit:", error);
                throw error;
            }
        }
    },
    getters: {
        allProduits: (state) => state.produits
    }
};