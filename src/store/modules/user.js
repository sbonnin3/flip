import { comptes } from '@/datasource/comptes';

export default {
  namespaced: true,
  state: {
    comptes: [],
    userSession: null
  },
  
  mutations: {
    SET_COMPTES(state, comptes) {
      state.comptes = comptes;
    },
    SET_USER_SESSION(state, session) {
      state.userSession = session;
      localStorage.setItem('userSession', JSON.stringify(session));
    },
    CLEAR_USER_SESSION(state) {
      state.userSession = null;
      localStorage.removeItem('userSession');
    },
    ADD_COMPTE(state, newCompte) {
      state.comptes.push(newCompte);
      localStorage.setItem('comptes', JSON.stringify(state.comptes));
    }
  },
  
  actions: {
    async initComptes({ commit }) {
      try {
        // 1. Essaye de charger depuis localStorage
        const localComptes = localStorage.getItem('comptes');
        
        if (localComptes) {
          commit('SET_COMPTES', JSON.parse(localComptes));
        } else {
          // 2. Fallback sur les comptes statiques
          commit('SET_COMPTES', [...comptes]);
          localStorage.setItem('comptes', JSON.stringify(comptes));
        }
      } catch (error) {
        console.error("Erreur chargement comptes:", error);
        // 3. Fallback ultime
        commit('SET_COMPTES', [...comptes]);
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