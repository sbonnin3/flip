import { comptes } from '@/datasource/comptes';

export default {
  namespaced: true,
  state: {
    comptes: [...comptes],
    userSession: null
  },
  
  mutations: {
    SET_COMPTES(state, comptes) {
      state.comptes = comptes;
    },
    SET_USER_SESSION(state, session) {
      state.userSession = session;
    },
    CLEAR_USER_SESSION(state) {
      state.userSession = null;
    },
    ADD_COMPTE(state, newCompte) {
      state.comptes.push(newCompte);
    }
  },
  
  actions: {
    async initComptes({ commit }) {
      try {
        commit('SET_COMPTES', [...comptes]);
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
    },
    
    async register({ commit, state }, newUser) {
      if (!state.comptes || state.comptes.length === 0) {
        await this.dispatch('user/initComptes');
      }
      
      const exists = state.comptes.some(c => c.identifiant === newUser.identifiant);
      if (!exists) {
        const completeUser = {
          ...newUser,
          id: Date.now(),
          telephone: newUser.telephone || "0102030405",
          photoProfil: newUser.photoProfil || "https://via.placeholder.com/150"
        };
        
        commit('ADD_COMPTE', completeUser);
        commit('SET_USER_SESSION', completeUser);
        return true;
      }
      return false;
    }
  },
  
  getters: {
    comptes: state => state.comptes || [],
    userSession: state => state.userSession,
    isAuthenticated: state => !!state.userSession
  }
};
