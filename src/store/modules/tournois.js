import { tournois } from "@/datasource/data";

const state = {
  tournois: tournois
};

const mutations = {
  SET_TOURNOIS(state, tournois) {
    state.tournois = tournois;
  },
  ADD_TOURNOI(state, tournoi) {
    state.tournois.push(tournoi);
  }
};

const actions = {
  async getAllTournois({ commit }) {
    commit("SET_TOURNOIS", tournois);
  },
  addTournoi({ commit }, tournoi) {
    commit('ADD_TOURNOI', tournoi);
  },
  async fetchTournoisByPrestataire({ commit, rootState }) {
    if (!rootState.auth.userSession) return;
    const prestataireId = rootState.auth.userSession.id;
    const tournoisForPrestataire = state.tournois.filter(
      t => t.prestataireId === prestataireId
    );
    commit('SET_TOURNOIS', tournoisForPrestataire);
  }
};

const getters = {
  tournois: state => state.tournois
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};