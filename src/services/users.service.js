import {getRequest, putRequest, deleteRequest, postRequest} from "@/services/axios.service";

async function createUserFromAPI(data) {
    try {
        return postRequest('/api/users', data, 'CREATEUSER')
    } catch (error) {
        console.error('Error creating user from API:', error);
        throw error;
    }
}

async function createUserService(data) {
    let answer = await createUserFromAPI(data)
    return answer
}

async function getUsersFromAPI() {
    try {
        return getRequest('/api/users', 'GETUSERS')
    } catch (error) {
        console.error('Error getting users from API:', error);
        throw error;
    }
}

async function getUserService() {
    let answer = await getUsersFromAPI()
    return answer
}

async function getUsersByIdFromAPI(id) {
    try {
        return getRequest('/api/users/' + id, 'GETUSERBYID')
    } catch (error) {
        console.error('Error getting user by ID from API:', error);
        throw error;
    }
}

async function getUserByIdService(id) {
    let answer = await getUsersByIdFromAPI(id)
    return answer
}

async function updateUserFromAPI(id, data) {
    try {
        return putRequest('/api/users/' + id, data, 'UPDATEUSER')
    } catch (error) {
        console.error('Error updating user from API:', error);
        throw error;
    }
}

async function updateUserService(id, data) {
    let answer = await updateUserFromAPI(id, data)
    return answer
}

async function deleteUserFromAPI(id) {
    try {
        return deleteRequest('/api/users/' + id, 'DELETEUSER')
    } catch (error) {
        console.error('Error deleting user from API:', error);
        throw error;
    }
}

async function deleteUserService(id) {
    let answer = await deleteUserFromAPI(id)
    return answer
}

async function getPasswordByIdFromAPI(id) {
    try {
        return getRequest('/api/users/' + id + '/check-password', 'GETPASSWORDBYID')
    } catch (error) {
        console.error('Error getting password by ID from API:', error);
        throw error;
    }
}

async function getPasswordByIdService(id) {
    let answer = await getPasswordByIdFromAPI(id)
    return answer
}



export default {
    createUserFromAPI,
    createUserService,
    getUsersFromAPI,
    getUserService,
    getUsersByIdFromAPI,
    getUserByIdService,
    updateUserFromAPI,
    updateUserService,
    deleteUserFromAPI,
    deleteUserService,
    getPasswordByIdFromAPI,
    getPasswordByIdService
}