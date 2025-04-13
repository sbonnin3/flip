import {
    getTournoiService,
    getEditionTournoiByIdService,
    getEditionTournoiService,
    inscriptionTournoiService,
    getInscriptionTournoisByIdUserService, getTournoiByIdService,
    createTournoiService, createEditionTournoiService, getAllInscriptionsTournoisService,
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
        },
        ADD_INSCRIPTION_TOURNOI(state, inscription) {
            state.inscriptionsTournoi.push(inscription);
        },
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

        async createTournoi({commit}, tournoi) {
            console.log("STORE: create tournoi")
            let result = null
            try {
                result = await createTournoiService(tournoi);
                commit('ADD_TOURNOI', result);
                console.log(result);
            } catch (err) {
                console.log("Cas anormal dans createTournoi()")
            }
        },

        async inscriptionTournoi({commit}, dataInscription) {
            console.log("STORE: inscription tournoi")
            let result = null
            try {
                result = await inscriptionTournoiService(dataInscription)
                commit('ADD_INSCRIPTION_TOURNOI', result)
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

        async createEditionTournoi({commit}, edition) {
            console.log("STORE: create edition tournoi")
            let result = null
            try {
                result = await createEditionTournoiService(edition)
                commit('ADD_EDITION_TOURNOI', result)
                console.log(result)
            } catch (err) {
                console.log("Cas anormal dans createEditionTournoi()")
            }
        },

        async getAllReservationTournois({commit}) {
            console.log("STORE: get all tournaments")
            let result = null
            try {
                result = await getAllInscriptionsTournoisService()
                commit('SET_INSCRIPTION_TOURNOI', result)
                console.log(result)
            } catch (err) {
                console.log("Cas anormal dans getAllReservationTournois()")
            }
        }














    },
    getters: {
        allTournoi: (state) => state.tournois || [],
        tournoisByUser: (state) => (userId) => {
            return state.tournois.filter(t => t.prestataireId === userId);
        },
        lastCreatedTournoiId: (state) => {
            if (state.tournois.length === 0) return null;
            // Supposons que les tournois sont triés par ordre de création (le dernier étant le plus récent)
            return state.tournois[state.tournois.length - 1].id;
        }
    }
};