// src/store/user.js
import { loginService, getSessionService, logoutService } from "@/services/serviceapi/auth";
import { getUserService, createUserService, deleteUserService } from "@/services/serviceapi/users";

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

        async login({ commit, dispatch }, credentials) {
            try {
                const result = await loginService(credentials);

                if (result === "Connecté") {
                    // Recharge les comptes à jour
                    await dispatch('initComptes');

                    // Met à jour la session immédiatement
                    commit('SET_USER_SESSION', `Logged in as ${credentials.identifiant}`);

                    // Trouve l'utilisateur correspondant
                    const user = this.state.user.comptes.find(u => u.identifiant === credentials.identifiant);
                    if (user) {
                        commit('SET_ACTUAL_USER', user);
                        return true;
                    }
                }
                return false;
            } catch (error) {
                console.error('Login error:', error);
                return false;
            }
        },

        async deleteCompte({commit}, id) {
            try {
                const result = await deleteUserService(id);
                commit('REMOVE_COMPTE', result);

            } catch (err) {
                console.log("Erreur dans deletecompte", err);
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
