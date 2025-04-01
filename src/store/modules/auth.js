const state = {
    userSession: null
  };
  
  const mutations = {
    SET_USER_SESSION(state, session) {
      state.userSession = session;
    },
    CLEAR_USER_SESSION(state) {
      state.userSession = null;
    }
  };
  
  const actions = {
    async login({ commit, rootState }, credentials) {
      try {
        // Vérification que les comptes sont bien chargés
        if (!rootState.comptes.comptes) {
          throw new Error("La liste des comptes n'est pas disponible");
        }
  
        // Recherche du compte avec les bons champs (identifiant/motDePasse)
        const compte = rootState.comptes.comptes.find(
          c => c.identifiant === credentials.identifiant && 
               c.motDePasse === credentials.motDePasse
        );
  
        if (compte) {
          commit('SET_USER_SESSION', {
            id: compte.id,
            role: compte.role,
            email: compte.email,
            nom: compte.nom,
            prenom: compte.prenom
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error("Erreur de connexion:", error);
        throw error;
      }
    },
    logout({ commit }) {
      commit('CLEAR_USER_SESSION');
    }
  };
  
  const getters = {
    userSession: state => state.userSession,
    isAuthenticated: state => !!state.userSession
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  };