import {getRequest, putRequest, deleteRequest, postRequest} from "@/services/axios.service";

async function createTypeFromAPI(data) {
    try {
        return postRequest('/api/types', data, 'CREATETYPE')
    } catch (error) {
        console.error('Error creating type from API:', error);
        throw error;
    }
}

async function createTypeService(data) {
    let answer = await createTypeFromAPI(data)
    return answer
}

async function getTypesFromAPI() {
    try {
        return getRequest('/api/types', 'GETTYPES')
    } catch (error) {
        console.error('Error getting types from API:', error);
        throw error;
    }
}

async function getTypeService() {
    let answer = await getTypesFromAPI()
    return answer
}

async function getTypeByIdFromAPI(id) {
    try {
        return getRequest('/api/types/' + id, 'GETTYPEBYID')
    } catch (error) {
        console.error('Error getting type by ID from API:', error);
        throw error;
    }
}

async function getTypeByIdService(id) {
    let answer = await getTypeByIdFromAPI(id)
    return answer
}

async function updateTypeFromAPI(id, data) {
    try {
        return putRequest('/api/types/' + id, data, 'UPDATETYPE')
    } catch (error) {
        console.error('Error updating type from API:', error);
        throw error;
    }
}

async function updateTypeService(id, data) {
    let answer = await updateTypeFromAPI(id, data)
    return answer
}

async function deleteTypeFromAPI(id) {
    try {
        return deleteRequest('/api/types/' + id, 'DELETETYPE')
    } catch (error) {
        console.error('Error deleting type from API:', error);
        throw error;
    }
}

async function deleteTypeService(id) {
    let answer = await deleteTypeFromAPI(id)
    return answer
}

export default {
    createTypeFromAPI,
    createTypeService,
    getTypesFromAPI,
    getTypeService,
    getTypeByIdFromAPI,
    getTypeByIdService,
    updateTypeFromAPI,
    updateTypeService,
    deleteTypeFromAPI,
    deleteTypeService
}