import {
    getTournoiService,
    getEditionTournoiByIdService,
    getEditionTournoiService,
    inscriptionTournoiService,
    getInscriptionTournoisByIdUserService, getTournoiByIdService
} from '@/services/serviceapi/tournaments';

export default {
    namespaced: true,
    state: {
        tournois: [],
        editionsTournoi: [],
        inscriptionsTournoi: [],
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
        },
        SET_EDITION_TOURNOIS(state, tournoi) {
            state.editionsTournoi = tournoi;
        },
        CLEAR_EDITION_TOURNOIS(state) {
            state.editionsTournoi = [];
        },
        REMOVE_TOURNOI(state, id) {
            state.tournois = state.tournois.filter(t => t._id !== id);
        },
        ADD_EDITION_TOURNOI(state, tournoi) {
            state.editionsTournoi.push(tournoi);
        },
        SET_INSCRIPTION_TOURNOI(state, inscriptions) {
            state.inscriptionsTournoi = inscriptions;
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

        async getTournoiById({commit}, id) {
            console.log("STORE: get tournament by id")
            let result = null
            try {
                result = await getTournoiByIdService(id)
                commit('SET_TOURNOIS', result)
                console.log(result)
            } catch (err) {
                console.log("Cas anormal dans getTournoiByID()")
            }
        },

        async getEditionTournoiById({commit}, id) {
            console.log("STORE: get tournament by id")
            let result = null
            try {
                result = await getEditionTournoiByIdService(id)
                console.log("Résultat récupéré pour getbyid edition :", JSON.stringify(result));  // Debug ici pour vérifier
                commit('SET_EDITION_TOURNOIS', result)
                console.log(result)
            } catch (err) {
                console.log("Cas anormal dans getEditionTournoiById()")
            }
        },

        async getEditionTournois({commit}) {
            console.log("STORE: get all tournaments")
            let result = null
            try {
                result = await getEditionTournoiService()
                console.log("Résultat récupéré pour tout les editions :", JSON.stringify(result));  // Debug ici pour vérifier
                commit('SET_EDITION_TOURNOIS', result)
                console.log(result)
            } catch (err) {
                console.log("Cas anormal dans getEditionTournois()")
            }
        },

        async inscriptionTournoi({commit}, dataInscription) {
            console.log("STORE: inscription tournoi")
            let result = null
            try {
                result = await inscriptionTournoiService(dataInscription)
                commit('SET_INSCRIPTION_TOURNOI', result)
                console.log(result)
            } catch (err) {
                console.log("Cas anormal dans inscriptionTournoi()")
            }
        },

        async getAllInscriptionTournoisByIdUser({commit}, id) {
            console.log("STORE: get all tournaments")
            let result = null
            try {
                result = await getInscriptionTournoisByIdUserService(id)
                commit('SET_INSCRIPTION_TOURNOI', result)
                console.log(result)
            } catch (err) {
                console.log("Cas anormal dans getAllInscriptionTournois()")
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