import {getRequest, postRequest} from "@/services/serviceapi/axios.service";


async function loginFromApi(data) {
    try {
        return postRequest('/api/session/login', data, 'LOGIN')
    } catch (error) {
        console.error('Error logging in from API:', error);
        throw error;
    }
}

export async function loginService(data) {
    let answer = await loginFromApi(data)
    return answer
}

async function logoutFromApi() {
    try {
        return postRequest('/api/session/logout', 'LOGOUT')
    } catch (error) {
        console.error('Error logging out from API:', error);
        throw error;
    }
}

export async function logoutService() {
    let answer = await logoutFromApi()
    return answer
}

async function getSessionFromApi() {
    try {
        return getRequest('/api/session/status', 'GETSESSION')
    } catch (error) {
        console.error('Error getting session from API:', error);
        throw error;
    }
}

export async function getSessionService() {
    let answer = await getSessionFromApi()
    return answer
}

export default {
    loginService,
    logoutService,
    getSessionService,
    loginFromApi,
    logoutFromApi,
    getSessionFromApi
}

