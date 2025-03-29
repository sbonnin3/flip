import {getRequest, putRequest, deleteRequest, postRequest} from "@/services/axios.service";

async function createTournoiFromAPI(data) {
    try {
        return postRequest('/api/tournamenets', data, 'CREATETOURNOI')
    } catch (error) {
        console.error('Error creating tournoi from API:', error);
        throw error;
    }
}

async function createTournoiService(data) {
    let answer = await createTournoiFromAPI(data)
    return answer
}

async function getTournoisFromAPI() {
    try {
        return getRequest('/api/tournaments', 'GETTOURNOIS')
    } catch (error) {
        console.error('Error getting tournois from API:', error);
        throw error;
    }
}

async function getTournoiService() {
    let answer = await getTournoisFromAPI()
    return answer
}

async function getTournoiByIdFromAPI(id) {
    try {
        return getRequest('/api/tournaments/' + id, 'GETTOURNOIBYID')
    } catch (error) {
        console.error('Error getting tournoi by ID from API:', error);
        throw error;
    }
}

async function getTournoiByIdService(id) {
    let answer = await getTournoiByIdFromAPI(id)
    return answer
}

async function updateTournoiByIdFromAPI(id, data) {
    try {
        return putRequest('/api/tournaments/' + id, data, 'UPDATETOURNOI')
    } catch (error) {
        console.error('Error updating tournoi from API:', error);
        throw error;
    }
}

async function updateTournoiByIdService(id, data) {
    let answer = await updateTournoiByIdFromAPI(id, data)
    return answer
}

async function deleteTournoiFromAPI(id) {
    try {
        return deleteRequest('/api/tournaments/' + id, 'DELETETOURNOI')
    } catch (error) {
        console.error('Error deleting tournoi from API:', error);
        throw error;
    }
}

async function deleteTournoiService(id) {
    let answer = await deleteTournoiFromAPI(id)
    return answer
}



export default {
    createTournoiFromAPI,
    createTournoiService,
    getTournoisFromAPI,
    getTournoiService,
    getTournoiByIdFromAPI,
    getTournoiByIdService,
    updateTournoiByIdFromAPI,
    updateTournoiByIdService,
    deleteTournoiFromAPI,
    deleteTournoiService
}