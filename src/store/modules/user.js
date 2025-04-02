import { comptes } from '@/datasource/comptes';

export default {
  namespaced: true,
  state: {
    comptes: [...comptes],
    userSession: null,
    redirectPath: null
  },
  
  mutations: {
    SET_COMPTES(state, comptes) {
      state.comptes = comptes;
    },
    SET_USER_SESSION(state, user) {
      state.userSession = user;
    },
    CLEAR_USER_SESSION(state) {
      state.userSession = null;
    },
    ADD_COMPTE(state, newCompte) {
      state.comptes.push(newCompte);
    },
    SET_REDIRECT_PATH(state, path) {
      state.redirectPath = path;
    },
    CLEAR_REDIRECT_PATH(state) {
      state.redirectPath = null;
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
    
    setRedirectPath({ commit }, path) {
      commit('SET_REDIRECT_PATH', path);
    },
    clearRedirectPath({ commit }) {
      commit('CLEAR_REDIRECT_PATH');
    },
    
    // Modifiez votre action login
    async login({ commit, dispatch, state }, credentials) {
      if (!state.comptes || state.comptes.length === 0) {
        await dispatch('initComptes');
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
    // Version originale nécessaire pour la connexion
    rawUserSession: state => state.userSession, 
    
    // Version sécurisée pour les templates
    userSession: (state) => {
      if (!state.userSession) return null; // Important pour isAuthenticated
      
      return {
        id: state.userSession.id || null,
        role: state.userSession.role || '',
        identifiant: state.userSession.identifiant || '',
        ...state.userSession
      };
    },
    
    isAuthenticated: state => !!state.userSession,
    comptes: state => state.comptes || []
  }
};
