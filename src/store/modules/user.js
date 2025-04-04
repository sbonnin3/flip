// import { getUserService } from "@/services/serviceapi/users";
import { loginService, getSessionService, logoutService } from "@/services/serviceapi/auth";

export default {
    namespaced: true,
    state: {
        userSession: null,
        comptes: [],
        redirectPath: null,
        isCheckingSession: false
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
        SET_CHECKING_SESSION(state, status) {
            state.isCheckingSession = status;
        },
        SET_REDIRECT_PATH(state, path) {
            state.redirectPath = path;
        },
        CLEAR_REDIRECT_PATH(state) {
            state.redirectPath = null;
        }
    },

    actions: {
        async checkSession({ commit, state }) {
            if (state.isCheckingSession) return;

            commit('SET_CHECKING_SESSION', true);
            try {
                const response = await getSessionService();
                if (typeof response === 'string' && response.indexOf('Logged in as') === 0) {
                    const username = response.split('Logged in as ')[1];
                    commit('SET_USER_SESSION', { identifiant: username });
                    return true;
                }
                commit('CLEAR_USER_SESSION');
                return false;
            } catch (error) {
                if (error.response?.status === 401) {
                    commit('CLEAR_USER_SESSION');
                }
                return false;
            } finally {
                commit('SET_CHECKING_SESSION', false);
            }
        },

        async login({ commit, dispatch }, credentials) {
            try {
                const result = await loginService(credentials);
                if (result === "Connecté") {
                    await dispatch('checkSession');
                    return true;
                }
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
        isCheckingSession: state => state.isCheckingSession,
        comptes: state => state.comptes,
        redirectPath: state => state.redirectPath
    }
}