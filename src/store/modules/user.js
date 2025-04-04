// src/store/user.js
import { loginService, getSessionService, logoutService } from "@/services/serviceapi/auth";
import { getUserService } from "@/services/serviceapi/users";

export default {
    namespaced: true,
    state: {
        userSession: null, // On ne stocke PLUS dans le localStorage
        comptes: [],
        redirectPath: null,
        actualUser: null,
    },

    mutations: {
        SET_COMPTES(state, comptes) {
            state.comptes = comptes;
        },
        SET_ACTUAL_USER(state, user) {
            state.actualUser = user;
        },
        SET_USERS(state, users) {
            state.users = users;
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
            try {
                const comptes = await getUserService();
                commit('SET_COMPTES', comptes);
            } catch (error) {
                console.error('Error fetching comptes:', error);
            }
        },

        async checkSession({ commit, state }) {
            try {
                const response = await getSessionService();
                if (typeof response === 'string' && response.startsWith('Logged in as')) {
                    commit('SET_USER_SESSION', state.actualUser);
                    return true;
                }
                commit('CLEAR_USER_SESSION');
                return false;
            } catch (error) {
                if (error.response?.status === 401) {
                    commit('CLEAR_USER_SESSION');
                    return false;
                }
                throw error;
            }
        },

        async login({ commit, state }, credentials) {
            try {
                const result = await loginService(credentials);

                if (result === "Connecté") {
                    console.log(JSON.stringify(state.comptes))
                    const user = state.comptes.find(
                        u =>
                            u.identifiant === credentials.identifiant &&
                            u.mdp === credentials.password
                    );


                    if (user) {
                        commit('SET_ACTUAL_USER', user);
                        return true;
                    }

                    // Sinon on nettoie et retourne false
                    commit('CLEAR_USER_SESSION');
                    return false;
                }

                commit('CLEAR_USER_SESSION');
                return false;
            } catch (error) {
                commit('CLEAR_USER_SESSION');
                return false;
            }
        },

        async logout({ commit }) {
            try {
                await logoutService();
            } finally {
                commit('CLEAR_USER_SESSION');
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