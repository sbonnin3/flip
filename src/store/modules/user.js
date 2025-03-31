import { comptes } from '@/datasource/comptes';

export default {
  namespaced: true,
  state: {
    comptes: [],
    userSession: JSON.parse(localStorage.getItem('userSession')) || null
  },

  mutations: {
    SET_COMPTES(state, comptes) {
      state.comptes = comptes;
    },
    SET_USER_SESSION(state, session) {
      state.userSession = session;
      localStorage.setItem('userSession', JSON.stringify(session));
    }
  },

  actions: {
    async initComptes({ commit }) {
      try {
        // Charge les comptes
        const localComptes = localStorage.getItem('comptes');
        const comptesInit = localComptes ? JSON.parse(localComptes) : [...comptes];
        commit('SET_COMPTES', comptesInit);
  
        // ✅ Restaurer la session utilisateur depuis localStorage
        const storedSession = localStorage.getItem('userSession');
        if (storedSession) {
          commit('SET_USER_SESSION', JSON.parse(storedSession));
        }
      } catch (error) {
        console.error("Erreur chargement comptes:", error);
      }
    },

    async login({ commit, state }, credentials) {
      if (!state.comptes || state.comptes.length === 0) {
        await this.dispatch('user/initComptes');
      }

      const user = state.comptes.find(
        c => c.identifiant === credentials.identifiant &&
          c.motDePasse === credentials.motDePasse
      );

      if (user) {
        commit('SET_USER_SESSION', user);
        return true;
      }
      return false;
    }
  },

  getters: {
    comptes: state => state.comptes,
    isAuthenticated: state => !!state.userSession,
    userSession: state => state.userSession,
    isAdmin: state => state.userSession?.role === 'administrateur',
  isOrganisateur: state => state.userSession?.role === 'organisateur',
  isPrestataire: state => {
    const prestataireRoles = ['restaurateur', 'vendeur', 'createur', 'organisateur'];
    return prestataireRoles.includes(state.userSession?.role);
  }
  }
};