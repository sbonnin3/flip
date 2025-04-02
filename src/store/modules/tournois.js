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
    },
    UPDATE_TOURNOI(state, { index, tournoi }) {
      state.tournois.splice(index, 1, tournoi);
    }
  },
  actions: {
    async getAllTournois({ commit }) {
      try {
        const { tournois } = await import("@/datasource/tournois");
        commit("SET_TOURNOIS", tournois);
      } catch (error) {
        console.error("Erreur chargement tournois:", error);
      }
    },
    
    async updateTournoi({ commit, state }, tournoi) {
      const index = state.tournois.findIndex(t => t._id === tournoi._id);
      if (index !== -1) {
        commit('UPDATE_TOURNOI', { index, tournoi });
        return tournoi;
      }
      throw new Error("Tournoi non trouvé");
    },
    
    async addTournoi({ commit }, tournoiData) {
      try {
        // Gestion de l'image
        let imageUrl;
        
        if (tournoiData.image instanceof File) {
          // Si c'est un fichier uploadé, créer une URL temporaire
          imageUrl = URL.createObjectURL(tournoiData.image);
        } else if (tournoiData.image) {
          // Si c'est déjà une URL (pour l'édition)
          imageUrl = tournoiData.image;
        } else {
          // Image par défaut
          imageUrl = require('@/assets/images/default-tournoi.png');
        }

        // Formatage des dates
        const formattedDates = tournoiData.dates.map(date => ({
          jour: Number(date.jour),
          mois: Number(date.mois),
          annee: Number(date.annee),
          heures: Number(date.heures),
          min: Number(date.min),
          placesRestantes: Number(date.placesRestantes)
        }));

        const newTournoi = {
          _id: Date.now().toString(),
          nom: tournoiData.nom,
          lieu: tournoiData.lieu,
          prix: Number(tournoiData.prix),
          image: imageUrl,
          description: tournoiData.description || '',
          prestataireId: tournoiData.prestataireId,
          dates: formattedDates
        };

        commit('ADD_TOURNOI', newTournoi);
        return newTournoi;

      } catch (error) {
        console.error("Erreur lors de l'ajout du tournoi:", error);
        throw error;
      }
    }
  },
  getters: {
    allTournoi: (state) => state.tournois || [],
    tournoisByUser: (state) => (userId) => {
      return state.tournois.filter(t => t.prestataireId === userId);
    }
  }
};