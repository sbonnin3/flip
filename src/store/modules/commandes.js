export default {
    namespaced: true,
    state: {
      userOrders: [],
      currentOrder: []
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
      }
    },
    actions: {
      addArticleOrder({ commit, state }, order) {
        const updatedOrders = [...state.userOrders, order];
        commit('SET_USER_ORDERS', updatedOrders);
      }
    },
    getters: {
      userOrders: (state) => state.userOrders,
      currentOrder: (state) => state.currentOrder
    }
  };
  