import { getRequest, postRequest, putRequest, deleteRequest } from "@/services/axios.service";

async function getUsersFromAPI() {
    try {
        return getRequest('/api/users', 'GETUSERS');
    } catch (error) {
        console.error('Error getting users from API:', error);
        throw error;
    }
}

async function createUserFromAPI(data) {
    try {
        return postRequest('/api/users', data, 'CREATEUSER');
    } catch (error) {
        console.error('Error creating user from API:', error);
        throw error;
    }
}

async function updateUserFromAPI(id, data) {
    try {
        return putRequest(`/api/users/${id}`, data, 'UPDATEUSER');
    } catch (error) {
        console.error('Error updating user from API:', error);
        throw error;
    }
}

async function deleteUserFromAPI(id) {
    try {
        return deleteRequest(`/api/users/${id}`, 'DELETEUSER');
    } catch (error) {
        console.error('Error deleting user from API:', error);
        throw error;
    }
}

export default {
    getUsersFromAPI,
    createUserFromAPI,
    updateUserFromAPI,
    deleteUserFromAPI,
};