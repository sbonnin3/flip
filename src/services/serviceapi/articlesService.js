import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/articles';

export const createArticle = async (articleData) => {
  return await axios.post(API_BASE_URL, articleData);
};

export const getArticles = async () => {
  return await axios.get(API_BASE_URL);
};

export const getArticleById = async (id) => {
  return await axios.get(`${API_BASE_URL}/${id}`);
};

export const updateArticle = async (id, articleData) => {
  return await axios.put(`${API_BASE_URL}/${id}`, articleData);
};

export const deleteArticle = async (id) => {
  return await axios.delete(`${API_BASE_URL}/${id}`);
};