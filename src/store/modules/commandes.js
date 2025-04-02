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
        addArticleOrder({ commit, state }, order) {
            // 1. Vérification de la commande
            if (!order.orderNumber || !order.userId) {
                console.error("Commande invalide:", order);
                return;
            }

            // 2. Mise à jour de userOrders (sans doublons)
            const userOrders = [
                ...state.userOrders.filter(o => o.orderNumber !== order.orderNumber),
                order
            ];

            // 3. Mise à jour de allOrders (sans doublons)
            const allOrders = [
                ...state.allOrders.filter(o => o.orderNumber !== order.orderNumber),
                order
            ];

            commit('SET_USER_ORDERS', userOrders);
            commit('SET_ALL_ORDERS', allOrders);

            console.log("Commande ajoutée:", { order, userOrders, allOrders });
        },

        setCurrentOrder({ commit }, orders) {
            if (!Array.isArray(orders)) {
                console.error("setCurrentOrder attend un tableau");
                return;
            }

            // Pour le panier en cours (currentOrder)
            commit('SET_CURRENT_ORDER', orders);

            // Optionnel : ajouter aussi à userOrders ?
            orders.forEach(order => this.dispatch('addArticleOrder', order));
        },

        resetCurrentOrder({ commit }) {
            commit('RESET_CURRENT_ORDER');
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
            // Utilise le getter sécurisé plutôt que d'accéder directement à state
            const userId = rootState.user.userSession?.id;

            if (!userId) {
                console.warn("Aucun userId - impossible de charger les commandes");
                return;
            }

            // Convertir en Number pour comparaison sûre
            const numUserId = Number(userId);
            const userOrders = state.allOrders.filter(order =>
                Number(order.userId) === numUserId
            );

            console.log("Commandes filtrées pour userId", userId, ":", userOrders);
            commit('SET_USER_ORDERS', userOrders);
        }
    },
    getters: {
        userOrders: state => state.userOrders || [],
        currentOrder: state => state.currentOrder || [],
        allOrders: state => state.allOrders || []
    }
};