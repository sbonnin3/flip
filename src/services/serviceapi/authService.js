import {getRequest, postRequest} from '@/services/serviceapi/axios.service';

export const login = async (identifiant, password) => {
    const data = { identifiant, password };
    return await postRequest('/login', data);
};

export const logout = async () => {
    return await postRequest('/logout');
};
