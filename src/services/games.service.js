import {getRequest, putRequest, deleteRequest, postRequest} from "@/services/axios.service";

async function createGameFromAPI(data) {
    try {
        return postRequest('/api/games', data, 'CREATEGAME')
    } catch (error) {
        console.error('Error creating game from API:', error);
        throw error;
    }
}

async function createGameService(data) {
    let answer = await createGameFromAPI(data)
    return answer
}

async function getGamesFromAPI() {
    try {
        return getRequest('/api/games', 'GETGAMES')
    } catch (error) {
        console.error('Error getting games from API:', error);
        throw error;
    }
}

async function getGameService() {
    let answer = await getGamesFromAPI()
    return answer
}

async function getGameByIdFromAPI(id) {
    try {
        return getRequest('/api/games/' + id, 'GETGAMEBYID')
    } catch (error) {
        console.error('Error getting game by ID from API:', error);
        throw error;
    }
}

async function getGameByIdService(id) {
    let answer = await getGameByIdFromAPI(id)
    return answer
}

async function updateGameFromAPI(id, data) {
    try {
        return putRequest('/api/games/' + id, data, 'UPDATEGAME')
    } catch (error) {
        console.error('Error updating game from API:', error);
        throw error;
    }
}

async function updateGameService(id, data) {
    let answer = await updateGameFromAPI(id, data)
    return answer
}

async function deleteGameFromAPI(id) {
    try {
        return deleteRequest('/api/games/' + id, 'DELETEGAME')
    } catch (error) {
        console.error('Error deleting game from API:', error);
        throw error;
    }
}

async function deleteGameService(id) {
    let answer = await deleteGameFromAPI(id)
    return answer
}

export default {
    createGameFromAPI,
    createGameService,
    getGamesFromAPI,
    getGameService,
    getGameByIdFromAPI,
    getGameByIdService,
    updateGameFromAPI,
    updateGameService,
    deleteGameFromAPI,
    deleteGameService
}