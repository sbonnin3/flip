import {getRequest, postRequest, putRequest, deleteRequest} from "@/services/axios.service";

async function getBasketsFromAPI() {
    try {
        return getRequest('/api/basket', 'GETBASKETS')
    } catch (error) {
        console.error('Error getting baskets from API:', error);
        throw error;
    }
}

async function getBasketsService() {
    let answer = await getBasketsFromAPI()
    return answer
}

async function createBasketFromAPI(data) {
    try {
        return postRequest('/api/basket', data, 'CREATEORG')
    } catch (error) {
        console.error('Error updating basket from API:', error);
        throw error;
    }
}

async function createBasketService(data) {
    let answer = await createBasketFromAPI(data)
    return answer
}

async function getBasketByIdFromAPI(id) {
    try {
        return getRequest('/api/basket/' + id, 'GETBASKETBYID')
    } catch (error) {
        console.error('Error getting basket by ID from API:', error);
        throw error;
    }
}

async function getBasketByIdService(id) {
    let answer = await getBasketByIdFromAPI(id)
    return answer
}

async function updateBasketFromAPI(id, data) {
    try {
        return putRequest('/api/basket/' + id, data, 'UPDATEBASKET')
    } catch (error) {
        console.error('Error updating basket from API:', error);
        throw error;
    }
}

async function updateBasketService(id, data) {
    let answer = await updateBasketFromAPI(id, data)
    return answer
}

async function deleteBasketFromAPI(id) {
    try {
        return deleteRequest('/api/basket/' + id, 'DELETEBASKET')
    } catch (error) {
        console.error('Error deleting basket from API:', error);
        throw error;
    }
}

async function deleteBasketService(id) {
    let answer = await deleteBasketFromAPI(id)
    return answer
}

async function getBasketOrderFromAPI() {
    try {
        return getRequest('/api/basket/order', 'GETBASKETORDER')
    } catch (error) {
        console.error('Error getting order basket from API:', error);
        throw error;
    }
}

async function getBasketOrderService() {
    let answer = await getBasketOrderFromAPI()
    return answer
}

async function addProductToBasketFromAPI(data) {
    try {
        return postRequest('/api/basket/addproduct', data, 'ADDPRODUCTTOBASKET')
    } catch (error) {
        console.error('Error adding product to basket from API:', error);
        throw error;
    }
}

async function addProductToBasketService(data) {
    let answer = await addProductToBasketFromAPI(data)
    return answer
}

async function removeProductToBasketFromAPI(data) {
    try {
        return putRequest('/api/basket/removeProduct', data, 'REMOVEPRODUCTTOBASKET')
    } catch (error) {
        console.error('Error removing product to basket from API:', error);
        throw error;
    }
}

async function removeProductToBasketService(data) {
    let answer = await removeProductToBasketFromAPI(data)
    return answer
}

async function updateProductFromBasketFromAPI(data) {
    try {
        return putRequest('/api/basket/updateProduct', data, 'UPDATEPRODUCTFROMBASKET')
    } catch (error) {
        console.error('Error updating product from basket from API:', error);
        throw error;
    }
}

async function updateProductFromBasketService(data) {
    let answer = await updateProductFromBasketFromAPI(data)
    return answer
}

async function getUserHistoricFromAPI(id) {
    try {
        return getRequest('/api/basket/user/' + id, 'GETUSERHISTORIC')
    } catch (error) {
        console.error('Error getting user historic from API:', error);
        throw error;
    }
}

async function getUserHistoricService(id) {
    let answer = await getUserHistoricFromAPI(id)
    return answer
}

async function getSpecificOrderFromAPI(id) {
    try {
        return getRequest('/api/basket/specificOrder/' + id, 'GETSPECIFICORDER')
    } catch (error) {
        console.error('Error getting specific order from API:', error);
        throw error;
    }
}

async function getSpecificOrderService(id) {
    let answer = await getSpecificOrderFromAPI(id)
    return answer
}

async function sendBasketToHistoricFromAPI(id, data) {
    try {
        return postRequest('/api/basket/sendBasket/' + id, data, 'SENDHISTORIC')
    } catch (error) {
        console.error('Error sending basket to historic from API:', error);
        throw error;
    }
}

async function sendBasketToHistoricService(id, data) {
    let answer = await sendBasketToHistoricFromAPI(id, data)
    return answer
}


export default {
    getBasketsService,
    getBasketsFromAPI,
    createBasketService,
    createBasketFromAPI,
    getBasketByIdService,
    getBasketByIdFromAPI,
    updateBasketService,
    updateBasketFromAPI,
    deleteBasketService,
    deleteBasketFromAPI,
    getBasketOrderService,
    getBasketOrderFromAPI,
    addProductToBasketService,
    addProductToBasketFromAPI,
    removeProductToBasketService,
    removeProductToBasketFromAPI,
    updateProductFromBasketService,
    updateProductFromBasketFromAPI,
    getUserHistoricService,
    getUserHistoricFromAPI,
    getSpecificOrderService,
    getSpecificOrderFromAPI,
    sendBasketToHistoricService,
    sendBasketToHistoricFromAPI
}