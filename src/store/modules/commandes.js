export default {
    namespaced: true,
    state: {
        userOrders: [],
        currentOrder: [],
        allOrders: [] 
    },
    mutations: {
        SET_USER_ORDERS(state, orders) {
            state.userOrders = orders;
        },
        SET_CURRENT_ORDER(state, order) {
            state.currentOrder = order;
        },
        RESET_CURRENT_ORDER(state) {
            state.currentOrder = [];
        },
        SET_ALL_ORDERS(state, orders) {
            state.allOrders = orders;
        }
    },
    actions: {
        // Version corrigée (sans warning ESLint)
        async fetchAllOrders({ dispatch }) {  // On utilise dispatch au lieu de commit
            await dispatch('commandes/initOrders'); 
        },

        addArticleOrder({ commit, state }, order) {
            const updatedOrders = [...state.userOrders, order];
            commit('SET_USER_ORDERS', updatedOrders);
        },

        async initOrders({ commit }) {
            try {
                const { commandes } = require("@/datasource/data");
                commit('SET_ALL_ORDERS', commandes);
            } catch (error) {
                console.error("Erreur chargement commandes:", error);
                commit('SET_ALL_ORDERS', []);
            }
        },

        async loadUserOrders({ commit, rootState, state }) {
            const userId = rootState.user.userSession?.id;
            if (userId) {
                const userOrders = state.allOrders.filter(order => order.userId === userId);
                commit('SET_USER_ORDERS', userOrders);
            }
        },
    },
    getters: {
        userOrders: state => state.userOrders || [],
        currentOrder: state => state.currentOrder || [],
        allOrders: state => state.allOrders || []
    }
};