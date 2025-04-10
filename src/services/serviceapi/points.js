import {putRequest, getRequest} from "@/services/serviceapi/axios.service";

async function getPointsFromAPI() {
    try {
        return getRequest('/api/emplacements', 'GETPOINTS')
    } catch (error) {
        console.error('Error getting points from API:', error);
        throw error;
    }
}

export async function getPointsService() {
    let answer = await getPointsFromAPI()
    return answer
}

async function getPointsByIdFromAPI(id) {
    try {
        return getRequest('/api/emplacements/' + id, 'GETPOINTS')
    } catch (error) {
        console.error('Error getting points by ID from API:', error);
        throw error;
    }
}

export async function getPointsByIdService(id) {
    let answer = await getPointsByIdFromAPI(id)
    return answer
}

async function getPointDisponibilite(id) {
    try {
        return getRequest('/api/emplacements/' + id + "/disponibilite", 'GETPOINTS')
    } catch (error) {
        console.error('Error getting points by ID from API:', error);
        throw error;
    }
}

export async function getPointDisponibiliteService(id) {
    let answer = await getPointDisponibilite(id)
    return answer
}

async function updateDisponibilitePointFromAPI(id) {
    try {
        return putRequest('/api/emplacements/' + id + "/disponibilite", 'PUTPOINTS')
    } catch (error) {
        console.error('Error updating point availability from API:', error);
        throw error;
    }
}

export async function updateDisponibilitePointService(id) {
    let answer = await updateDisponibilitePointFromAPI(id)
    return answer
}

export default {
    getPointsFromAPI,
    getPointsService,
    getPointsByIdFromAPI,
    getPointsByIdService,
    getPointDisponibilite,
    getPointDisponibiliteService,
    updateDisponibilitePointFromAPI,
}