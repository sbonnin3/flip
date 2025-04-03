import {getTournoiService} from '@/services/serviceapi/tournaments';

export default {
    namespaced: true,
    state: {
        tournois: [],
        editionTournois: [],
    },
    mutations: {
        SET_TOURNOIS(state, tournois) {
            state.tournois = tournois;
        },
        ADD_TOURNOI(state, tournoi) {
            state.tournois.push(tournoi);
        },
        UPDATE_TOURNOI(state, {index, tournoi}) {
            state.tournois.splice(index, 1, tournoi);
        }
    },
    actions: {
        async getAllTournois({commit}) {
            console.log("STORE: get all tournaments")
            let result = null
            try {
                result = await getTournoiService()
                commit('SET_TOURNOIS', result)
                console.log(result)
            } catch (err) {
                console.log("Cas anormal dans getAllTournois()")
            }
        },

        async updateTournoi({commit, state}, tournoi) {
            const index = state.tournois.findIndex(t => t._id === tournoi._id);
            if (index !== -1) {
                commit('UPDATE_TOURNOI', {index, tournoi});
                return tournoi;
            }
            throw new Error("Tournoi non trouvé");
        },

        async addTournoi({commit}, tournoiData) {
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
                    imageUrl = require('@/assets/images/null.png');
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