import axios from 'axios';

const API_URL = '/api/comments';

const API_URL_RATINGS = '/api/notes';

export default {
  async fetchComments(restaurantId) {
    const response = await axios.get(`${API_URL}/comm/stand/${restaurantId}`);
    return response.data;
  },

  async addComment(restaurantId,authorId, comment) {
    const response = await axios.post(`${API_URL}`, { authorId,restaurantId, comment });
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



  /// Ratings ///







  async fetchRatings(restaurantId) {
    const response = await axios.get(`${API_URL_RATINGS}?idStand=${restaurantId}`);
    return response.data;
  },

  async addRating(restaurantId,idUser, rating) {
    const response = await axios.post(`${API_URL_RATINGS}/`, { restaurantId ,idUser, ...rating });
    return response.data;
  },

  async updateRating(ratingId, updatedRating) {
    const response = await axios.put(`${API_URL_RATINGS}/${ratingId}`, updatedRating);
    return response.data;
  },

  async deleteRating(ratingId) {
    const response = await axios.delete(`${API_URL_RATINGS}`, ratingId);
    return response.data;
  },
};