import { getGamesService } from "@/services/serviceapi/games";
import { getArticleByIdService} from "@/services/serviceapi/article";

export default {
  namespaced: true,
  state: {
    jeux: [],
    jeuxCreation: []
  },
  mutations: {
    SET_JEUX(state, jeux) {
      state.jeux = jeux;
    },
    SET_JEUX_CREATION(state, jeuxCreation) {
      state.jeuxCreation = jeuxCreation;
    },
    ADD_JEUX(state, jeux) {
      state.jeux.push(jeux);
    }
  },
  actions: {
    async fetchJeuxCreation({ commit }) {
      try {
        const jeuxCreation = require("@/datasource/data").jeuxCreation;
        commit('SET_JEUX_CREATION', jeuxCreation);
        return jeuxCreation;
      } catch (error) {
        console.error("Error loading jeuxCreation:", error);
        return [];
      }
    },
    async getAllJeux({commit}) {
      console.log("STORE: get all jeux")
      try {
        const result = await getGamesService()

        // Si l'API ne fait pas la jointure, il faut la faire côté front
        const jeuxAvecProduits = await Promise.all(
            result.map(async jeu => {
              // Supposons que vous avez un service pour récupérer le produit
              const produit = await getArticleByIdService(jeu.produit_id)
              return {
                ...jeu,
                produit: produit || null // Ajoute la relation produit
              }
            })
        )

        commit('SET_JEUX', jeuxAvecProduits)
        console.log("Jeux avec produits chargés:", jeuxAvecProduits)
      } catch(err) {
        console.error("Erreur dans getAllJeux():", err)
      }
    },
  },
  getters: {
    allJeux: (state) => state.jeux || [],
    jeuxCreation: (state) => state.jeuxCreation || []
  }
};
