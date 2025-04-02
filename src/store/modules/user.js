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
    },
    REMOVE_COMPTE(state, id) {
      state.comptes = state.comptes.filter(compte => compte.id !== id);
    },
    UPDATE_COMPTE(state, updatedCompte) {
      const index = state.comptes.findIndex(c => c.id === updatedCompte.id);
      if (index !== -1) {
        // Crée un nouveau tableau pour déclencher la réactivité
        state.comptes = [
          ...state.comptes.slice(0, index),
          updatedCompte,
          ...state.comptes.slice(index + 1)
        ];
      }
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
    },
    async removeCompte({ commit, dispatch }, id) {
      try {
        // En environnement réel, vous feriez ici un appel API si nécessaire
        // await api.deleteCompte(id);
        
        // En mode mock (avec vos données locales)
        commit('REMOVE_COMPTE', id);
        
        // Recharge les données si nécessaire
        await dispatch('initComptes');
        
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async updateCompte({ commit, state }, updatedCompte) {
      try {
        // En environnement réel, vous feriez ici un appel API si nécessaire
        // const response = await api.updateCompte(updatedCompte);
        
        // En mode mock (avec vos données locales)
        commit('UPDATE_COMPTE', updatedCompte);
        
        // Si vous éditez le compte connecté, mettez à jour la session
        if (state.userSession && state.userSession.id === updatedCompte.id) {
          commit('SET_USER_SESSION', updatedCompte);
        }
        
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }
  },
  
  getters: {
    rawUserSession: state => state.userSession, 
    
    userSession: (state) => {
      if (!state.userSession) return null;
      
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
