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
      async addTournoi({ commit }, formData) {
        try {
          // Extraction des données depuis FormData
          const getValue = (field) => formData.get(field)?.toString().trim();
          
          const tournoiData = {
            nom: getValue('nom'),
            lieu: getValue('lieu'),
            prix: Number(getValue('prix')) || 0,
            description: getValue('description') || '',
            prestataireId: getValue('prestataireId'),
            dates: JSON.parse(getValue('dates') || '[]'),
            image: formData.get('image') // Garde l'objet File pour upload
          };
      
          // Upload de l'image si elle existe
          let imageUrl = require('@/assets/images/default-tournoi.png');
          if (tournoiData.image instanceof File) {
            imageUrl = URL.createObjectURL(tournoiData.image);
          }
      
          const newTournoi = {
            ...tournoiData,
            _id: Date.now().toString(),
            image: imageUrl,
            dates: this.formatDates(tournoiData.dates)
          };
      
          commit('ADD_TOURNOI', newTournoi);
          return newTournoi;
      
        } catch (error) {
          console.error("Erreur addTournoi avec FormData:", error);
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