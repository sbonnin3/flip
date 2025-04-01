import { commandes } from "@/datasource/data";

const state = {
  userOrders: commandes,
  currentOrder: []
};

const mutations = {
  SET_USER_ORDERS(state, orders) {
    state.userOrders = orders;
  },
  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order;
  },
  RESET_CURRENT_ORDER(state) {
    state.currentOrder = [];
  },
  SET_COMMANDES(state, commandes) {
    state.userOrders = commandes;
  }
};

const actions = {
  fetchAllOrders({ commit }) {
    commit('SET_COMMANDES', commandes);
  },
  addArticleOrder({ commit, state }, order) {
    const updatedOrders = [...state.userOrders, order];
    commit('SET_USER_ORDERS', updatedOrders);
  },
  setCurrentOrder({ commit }, order) {
    commit('SET_CURRENT_ORDER', order);
  },
  resetCurrentOrder({ commit }) {
    commit('RESET_CURRENT_ORDER');
  }
};

const getters = {
  userOrders: (state, getters, rootState) => {
    if (rootState.auth.userSession) {
      return state.userOrders.filter(order => order.userId === rootState.auth.userSession.id);
    }
    return [];
  },
  currentOrder: state => state.currentOrder,
  allOrders: state => state.userOrders || []
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};