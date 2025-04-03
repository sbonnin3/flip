import axios from 'axios';

const API_URL = '/api/comments';

export default {
  async fetchComments(restaurantId) {
    const response = await axios.get(`${API_URL}?restaurantId=${restaurantId}`);
    return response.data;
  },

  async addComment(restaurantId, comment) {
    const response = await axios.post(`${API_URL}`, { restaurantId, ...comment });
    return response.data;
  },

  async updateComment(commentId, updatedComment) {
    const response = await axios.put(`${API_URL}/${commentId}`, updatedComment);
    return response.data;
  },

  async deleteComment(commentId) {
    const response = await axios.delete(`${API_URL}/${commentId}`);
    return response.data;
  },

  async fetchRatings(restaurantId) {
    const response = await axios.get(`${API_URL}/ratings?restaurantId=${restaurantId}`);
    return response.data;
  },

  async addRating(restaurantId, rating) {
    const response = await axios.post(`${API_URL}/ratings`, { restaurantId, ...rating });
    return response.data;
  },

  async updateRating(ratingId, updatedRating) {
    const response = await axios.put(`${API_URL}/ratings/${ratingId}`, updatedRating);
    return response.data;
  },

  async deleteRating(ratingId) {
    const response = await axios.delete(`${API_URL}/ratings/${ratingId}`);
    return response.data;
  },
};