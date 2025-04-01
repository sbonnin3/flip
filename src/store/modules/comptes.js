import { comptes } from "@/datasource/data";

const state = {
  comptes: comptes
};

const mutations = {
    SET_COMPTES(state, comptes) {
        state.comptes = comptes;
      },
      REMOVE_COMPTE(state, id) {
    state.comptes = state.comptes.filter(compte => compte.id !== id);
  },
  UPDATE_COMPTE(state, updatedCompte) {
    const index = state.comptes.findIndex(compte => compte.id === updatedCompte.id);
    if (index !== -1) {
      state.comptes.splice(index, 1, updatedCompte);
    }
  },
  ADD_COMPTE(state, nouveauCompte) {
    state.comptes.push(nouveauCompte);
  }
};

const actions = {
    loadComptes({ commit }) {
        commit('SET_COMPTES', comptes);
      },
      addCompte({ commit }, compte) {
    commit('ADD_COMPTE', compte);
  }
};

const getters = {
  comptes: state => state.comptes,
  getUserRole: state => userId => {
    const compte = state.comptes.find(compte => compte.id === userId);
    return compte ? compte.role : null;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};