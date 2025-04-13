import {getRequest, putRequest, deleteRequest, postRequest} from "@/services/serviceapi/axios.service";

async function createTournoiFromAPI(data) {
    try {
        return postRequest('/api/tournaments', data, 'CREATETOURNOI')
    } catch (error) {
        console.error('Error creating tournoi from API:', error);
        throw error;
    }
}

export async function createTournoiService(data) {
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

export async function getTournoiService() {
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

export async function getTournoiByIdService(id) {
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

async function getEditionTournoiByIdFromAPI(id) {
    try {
        return getRequest('/api/tournaments/editions/' + id, 'GETEDITIONTOURNOIBYID')
    } catch (error) {
        console.error('Error getting edition tournoi by ID from API:', error);
        throw error;
    }
}

export async function getEditionTournoiByIdService(id) {
    let answer = await getEditionTournoiByIdFromAPI(id)
    return answer
}

async function getEditionTournoisFromAPI() {
    try {
        return getRequest('/api/editions/getAllEditions', 'GETEDITIONTOURNOIS')
    } catch (error) {
        console.error('Error getting edition tournois from API:', error);
        throw error;
    }
}

export async function getEditionTournoiService() {
    let answer = await getEditionTournoisFromAPI()
    return answer
}

async function inscriptionTournoiFromAPI(dataInscription) {
    try {
        return postRequest('/api/inscription/inscrire/', dataInscription,'INSCRIPTIONTOURNOI')
    } catch (error) {
        console.error('Error creating tournoi from API:', error);
        throw error;
    }
}

export async function inscriptionTournoiService(dataInscription) {
    let answer = await inscriptionTournoiFromAPI(dataInscription)
    return answer
}

async function getInscriptionTournoisByIdUserFromAPI(id) {
    try {
        return getRequest('/api/inscription/inscriptions/' + id, 'GETINSCRIPTIONTOURNOIS')
    } catch (error) {
        console.error('Error getting inscription tournois from API:', error);
        throw error;
    }
}

export async function getInscriptionTournoisByIdUserService(id) {
    let answer = await getInscriptionTournoisByIdUserFromAPI(id)
    return answer
}

async function createEditionTournoiFromAPI(data) {
    try {
        return postRequest('/api/tournaments/editions', data, 'CREATEEDITIONS')
    } catch (error) {
        console.error('Error creating edition tournoi from API:', error);
        throw error;
    }
}

export async function createEditionTournoiService(data) {
    let answer = await createEditionTournoiFromAPI(data)
    return answer
}

async function getAllInscriptionsTournoisFromAPI() {
    try {
        return getRequest('/api/inscription/inscriptions', 'GETALLINSCRIPTIONS')
    } catch (error) {
        console.error('Error getting all inscriptions tournois from API:', error);
        throw error;
    }
}

export async function getAllInscriptionsTournoisService() {
    let answer = await getAllInscriptionsTournoisFromAPI()
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
    deleteTournoiService,
    getEditionTournoiByIdService,
    getEditionTournoiByIdFromAPI,
    getEditionTournoiService,
    getEditionTournoisFromAPI,
    inscriptionTournoiFromAPI,
    inscriptionTournoiService,
    getInscriptionTournoisByIdUserFromAPI,
    getInscriptionTournoisByIdUserService
}