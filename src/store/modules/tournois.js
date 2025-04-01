export default {
    namespaced: true,
    state: {
        tournois: require("@/datasource/data").tournois || [] // Chargement direct
    },
    mutations: {
        SET_TOURNOIS(state, tournois) {
            state.tournois = tournois;
        },
        ADD_TOURNOI(state, tournoi) {
            state.tournois.push(tournoi);
        }
    },
    actions: {
        async getAllTournois({ commit, state }) {
            try {
                // Recharge les données si nécessaire (pour actualisation)
                if (state.tournois.length === 0) {
                    const { tournois } = require("@/datasource/data");
                    commit('SET_TOURNOIS', tournois);
                }
            } catch (error) {
                console.error("Erreur chargement tournois:", error);
            }
        }
    },
    getters: {
        allTournois: state => state.tournois
    }
};