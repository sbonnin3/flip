import {postRequest, getRequest} from "@/services/serviceapi/axios.service";

export async function createGameReservationService(data) {
    try {
        return postRequest('/api/reservJeu/reservations', data, 'CREATEGAME')
    } catch (error) {
        console.error('Error creating reservation for a game from API:', error);
        throw error;
    }
}

async function createGameReservationFromAPI(data) {
    let answer = await createGameReservationService(data)
    return answer
}

async function getGameReservationByUserIdFromAPI(id) {
    try {
        return getRequest('/api/reservJeu/reservations/user/' + id, 'GETRESERVATIONSUSER')
    } catch (error) {
        console.error('Error getting reservations by user ID from API:', error);
        throw error;
    }
}

export async function getGameReservationByUserIdService(id) {
    let answer = await getGameReservationByUserIdFromAPI(id)
    return answer
}

export default {
    createGameReservationService,
    createGameReservationFromAPI,
    getGameReservationByUserIdFromAPI,
    getGameReservationByUserIdService
}