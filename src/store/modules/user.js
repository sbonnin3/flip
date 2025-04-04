// src/store/user.js
import { loginService, getSessionService, logoutService } from "@/services/serviceapi/auth";
import { getUserService, createUserService } from "@/services/serviceapi/users";

export default {
    namespaced: true,
    state: {
        userSession: null, // On ne stocke PLUS dans le localStorage
        comptes: [],
        redirectPath: null,
        actualUser: [],
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
            state.actualUser = null;
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
        async register({ commit }, userData) {
            try {
                const createdUser = await createUserService(userData);
                commit('ADD_COMPTE', createdUser);
                return true;
            } catch (error) {
                console.error('Error registering user:', error);
                return false;
            }
        },

        async initComptes({ commit }) {
            try {
                const comptes = await getUserService();
                commit('SET_COMPTES', comptes);
            } catch (error) {
                console.error('Error fetching comptes:', error);
            }
        },

        async checkSession({ commit, dispatch, state }) {
            if (localStorage.getItem('loggedOut') === 'true') {
                commit('CLEAR_USER_SESSION');
                localStorage.removeItem('loggedOut');
                return false;
            }
            try {
                const response = await getSessionService();
                if (typeof response === 'string' && response.startsWith('Logged in as')) {
                    commit('SET_USER_SESSION', response);
                    if (state.comptes.length === 0) {
                        await dispatch('initComptes');
                    }
                    const identifiant = response.split(' ')[3];
                    const user = state.comptes.find(u => u.identifiant === identifiant);
                    if (user) {
                        commit('SET_ACTUAL_USER', user);
                    } else {
                        commit('CLEAR_USER_SESSION');
                    }
                    return true;
                }
                commit('CLEAR_USER_SESSION');
                return false;
            } catch (error) {
                commit('CLEAR_USER_SESSION');
                return false;
            }
        },

        async login({ commit, state, dispatch }, credentials) {
            try {
                const result = await loginService(credentials);
                if (result === "Connecté") {
                    if (state.comptes.length === 0) {
                        await dispatch('initComptes');
                    }
                    const user = state.comptes.find(
                        u =>
                            u.identifiant === credentials.identifiant &&
                            u.mdp === credentials.password
                    );
                    if (user) {
                        // On commit à la fois la session et l'utilisateur actuel
                        commit('SET_USER_SESSION', result);
                        commit('SET_ACTUAL_USER', user);
                        return true;
                    }
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
                localStorage.setItem('loggedOut', 'true');
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
};
