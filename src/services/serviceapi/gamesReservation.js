import {postRequest} from "@/services/serviceapi/axios.service";

export async function createGameReservationService(data) {
    try {
        return postRequest('/aapi/reservJeu/reservations', data, 'CREATEGAME')
    } catch (error) {
        console.error('Error creating reservation for a game from API:', error);
        throw error;
    }
}

async function createGameReservationFromAPI(data) {
    let answer = await createGameReservationService(data)
    return answer
}

export default {
    createGameReservationService,
    createGameReservationFromAPI
}