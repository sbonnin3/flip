import {getRequest, postRequest, putRequest, deleteRequest} from "@/services/axios.service";

async function createArticleFromAPI(data) {
    try {
        return postRequest('/api/articles', data, 'CREATEARTICLE')
    } catch (error) {
        console.error('Error creating article from API:', error);
        throw error;
    }
}

async function createArticleService(data) {
    let answer = await createArticleFromAPI(data)
    return answer
}

async function getArticlesFromAPI() {
    try {
        return getRequest('/api/articles', 'GETARTICLES')
    } catch (error) {
        console.error('Error getting articles from API:', error);
        throw error;
    }
}

async function getArticleService() {
    let answer = await getArticlesFromAPI()
    return answer
}

async function getArticleByIdFromAPI(id) {
    try {
        return getRequest('/api/articles/' + id, 'GETARTICLES')
    } catch (error) {
        console.error('Error getting articles from API:', error);
        throw error;
    }
}

async function getArticleByIdService(id) {
    let answer = await getArticleByIdFromAPI(id)
    return answer
}

async function updateArticleFromAPI(id, data) {
    try {
        return putRequest('/api/articles/' + id, data, 'UPDATEARTICLE')
    } catch (error) {
        console.error('Error updating article from API:', error);
        throw error;
    }
}

async function updateArticleService(id, data) {
    let answer = await updateArticleFromAPI(id, data)
    return answer
}

async function deleteArticleFromAPI(id) {
    try {
        return deleteRequest('/api/articles/' + id, 'DELETEARTICLE')
    } catch (error) {
        console.error('Error deleting article from API:', error);
        throw error;
    }
}

async function deleteArticleService(id) {
    let answer = await deleteArticleFromAPI(id)
    return answer
}

export default {
    createArticleFromAPI,
    createArticleService,
    getArticlesFromAPI,
    getArticleService,
    getArticleByIdFromAPI,
    getArticleByIdService,
    updateArticleFromAPI,
    updateArticleService,
    deleteArticleFromAPI,
    deleteArticleService
}