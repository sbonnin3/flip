import commentsService from '@/services/serviceapi/commentsService';

const state = {
  comments: [],
  ratings: [],
};

const getters = {
  getComments: (state) => state.comments,
  getRatings: (state) => state.ratings,
};

const actions = {
  async fetchComments({ commit }, restaurantId) {
    const comments = await commentsService.fetchComments(restaurantId);
    commit('setComments', comments);
  },

  async addComment({ commit }, { restaurantId,userId, comment }) {
    const newComment = await commentsService.addComment(restaurantId,userId, comment);
    commit('addComment', newComment);
  },

  async updateComment({ commit }, { commentId, updatedComment }) {
    const updated = await commentsService.updateComment(commentId, updatedComment);
    commit('updateComment', updated);
  },

  async deleteComment({ commit }, commentId) {
    await commentsService.deleteComment(commentId);
    commit('deleteComment', commentId);
  },

  async fetchRatings({ commit }, restaurantId) {
    const ratings = await commentsService.fetchRatings(restaurantId);
    commit('setRatings', ratings);
  },

  async addRating({ commit }, { restaurantId, rating }) {
    const newRating = await commentsService.addRating(restaurantId, rating);
    commit('addRating', newRating);
  },

  async updateRating({ commit }, { ratingId, updatedRating }) {
    const updated = await commentsService.updateRating(ratingId, updatedRating);
    commit('updateRating', updated);
  },

  async deleteRating({ commit }, ratingId) {
    await commentsService.deleteRating(ratingId);
    commit('deleteRating', ratingId);
  },
};

const mutations = {
  setComments(state, comments) {
    state.comments = comments;
  },

  addComment(state, comment) {
    state.comments.push(comment);
  },

  updateComment(state, updatedComment) {
    const index = state.comments.findIndex((c) => c.id === updatedComment.id);
    if (index !== -1) {
      state.comments.splice(index, 1, updatedComment);
    }
  },

  deleteComment(state, commentId) {
    state.comments = state.comments.filter((c) => c.id !== commentId);
  },

  setRatings(state, ratings) {
    state.ratings = ratings;
  },

  addRating(state, rating) {
    state.ratings.push(rating);
  },

  updateRating(state, updatedRating) {
    const index = state.ratings.findIndex((r) => r.id === updatedRating.id);
    if (index !== -1) {
      state.ratings.splice(index, 1, updatedRating);
    }
  },

  deleteRating(state, ratingId) {
    state.ratings = state.ratings.filter((r) => r.id !== ratingId);
  },

  getAuthor(state, authorId) {
    const author = state.comments.find((comment) => comment.authorId === authorId);
    return author ? author.name : null;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};