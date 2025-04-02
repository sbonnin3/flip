// src/store/user.js
import userService from '@/services/userService';

export default {
  namespaced: true,
  state: {
    userSession: null,
    comptes: [],
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
    UPDATE_COMPTE(state, updatedCompte) {
      const index = state.comptes.findIndex(c => c.id === updatedCompte.id);
      if (index !== -1) {
        state.comptes.splice(index, 1, updatedCompte);
      }
    },
    REMOVE_COMPTE(state, id) {
      state.comptes = state.comptes.filter(c => c.id !== id);
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
      const comptes = await userService.getAllComptes();
      commit('SET_COMPTES', comptes);
    },
    
    async login({ commit }, credentials) {
      const user = await userService.login(credentials);
      if (user) {
        commit('SET_USER_SESSION', user);
        return true;
      }
      return false;
    },
    
    async register({ commit }, newUser) {
      try {
        const user = await userService.register(newUser);
        commit('ADD_COMPTE', user);
        commit('SET_USER_SESSION', user);
        return true;
      } catch (error) {
        console.error("Erreur d'inscription:", error);
        return false;
      }
    },
    
    async updateCompte({ commit, state }, updatedCompte) {
      try {
        const user = await userService.updateCompte(updatedCompte);
        commit('UPDATE_COMPTE', user);
        
        if (state.userSession?.id === user.id) {
          commit('SET_USER_SESSION', user);
        }
        return true;
      } catch (error) {
        console.error("Erreur de mise à jour:", error);
        return false;
      }
    },
    
    async removeCompte({ commit }, id) {
      try {
        await userService.deleteCompte(id);
        commit('REMOVE_COMPTE', id);
        return true;
      } catch (error) {
        console.error("Erreur de suppression:", error);
        return false;
      }
    },
    
    setRedirectPath({ commit }, path) {
      commit('SET_REDIRECT_PATH', path);
    },
    
    clearRedirectPath({ commit }) {
      commit('CLEAR_REDIRECT_PATH');
    }
  },
  
  getters: {
    userSession: state => state.userSession,
    isAuthenticated: state => !!state.userSession,
    comptes: state => state.comptes,
    redirectPath: state => state.redirectPath
  }
}