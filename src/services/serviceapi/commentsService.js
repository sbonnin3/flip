import { getRequest, postRequest, putRequest, deleteRequest } from "@/services/serviceapi/axios.service";

async function fetchComments(restaurantId) {
    try {
        return getRequest(`/api/comments/restaurant/${restaurantId}`, 'FETCH_COMMENTS');
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
}

async function addComment(restaurantId, comment) {
    try {
        return postRequest(`/api/comments/restaurant/${restaurantId}`, comment, 'ADD_COMMENT');
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
}

async function updateComment(commentId, updatedComment) {
    try {
        return putRequest(`/api/comments/${commentId}`, updatedComment, 'UPDATE_COMMENT');
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
}

async function deleteComment(commentId) {
    try {
        return deleteRequest(`/api/comments/${commentId}`, 'DELETE_COMMENT');
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
}

async function fetchRatings(restaurantId) {
    try {
        return getRequest(`/api/ratings/restaurant/${restaurantId}`, 'FETCH_RATINGS');
    } catch (error) {
        console.error('Error fetching ratings:', error);
        throw error;
    }
}

async function addRating(restaurantId, rating) {
    try {
        return postRequest(`/api/ratings/restaurant/${restaurantId}`, rating, 'ADD_RATING');
    } catch (error) {
        console.error('Error adding rating:', error);
        throw error;
    }
}

async function updateRating(ratingId, updatedRating) {
    try {
        return putRequest(`/api/ratings/${ratingId}`, updatedRating, 'UPDATE_RATING');
    } catch (error) {
        console.error('Error updating rating:', error);
        throw error;
    }
}

async function deleteRating(ratingId) {
    try {
        return deleteRequest(`/api/ratings/${ratingId}`, 'DELETE_RATING');
    } catch (error) {
        console.error('Error deleting rating:', error);
        throw error;
    }
}

export default {
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    fetchRatings,
    addRating,
    updateRating,
    deleteRating
};