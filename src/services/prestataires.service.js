import {getRequest, putRequest, deleteRequest, postRequest} from "@/services/axios.service";

async function createPrestataireFromAPI(data) {
    try {
        return postRequest('/api/prestataires', data, 'CREATEPRESTATAIRE')
    } catch (error) {
        console.error('Error creating prestataire from API:', error);
        throw error;
    }
}

async function createPrestataireService(data) {
    let answer = await createPrestataireFromAPI(data)
    return answer
}

async function getPrestatairesFromAPI() {
    try {
        return getRequest('/api/prestataires', 'GETPRESTATAIRES')
    } catch (error) {
        console.error('Error getting prestataires from API:', error);
        throw error;
    }
}

async function getPrestataireService() {
    let answer = await getPrestatairesFromAPI()
    return answer
}

async function getPrestataireByIdFromAPI(id) {
    try {
        return getRequest('/api/prestataires/' + id, 'GETPRESTATAIREBYID')
    } catch (error) {
        console.error('Error getting prestataire by ID from API:', error);
        throw error;
    }
}

async function getPrestataireByIdService(id) {
    let answer = await getPrestataireByIdFromAPI(id)
    return answer
}

async function updatePrestataireFromAPI(id, data) {
    try {
        return putRequest('/api/prestataires/' + id, data, 'UPDATEPRESTATAIRE')
    } catch (error) {
        console.error('Error updating prestataire from API:', error);
        throw error;
    }
}

async function updatePrestataireService(id, data) {
    let answer = await updatePrestataireFromAPI(id, data)
    return answer
}

async function deletePrestataireFromAPI(id) {
    try {
        return deleteRequest('/api/prestataires/' + id, 'DELETEPRESTATAIRE')
    } catch (error) {
        console.error('Error deleting prestataire from API:', error);
        throw error;
    }
}

async function deletePrestataireService(id) {
    let answer = await deletePrestataireFromAPI(id)
    return answer
}


export default {
    createPrestataireFromAPI,
    createPrestataireService,
    getPrestatairesFromAPI,
    getPrestataireService,
    getPrestataireByIdFromAPI,
    getPrestataireByIdService,
    updatePrestataireFromAPI,
    updatePrestataireService,
    deletePrestataireFromAPI,
    deletePrestataireService
}