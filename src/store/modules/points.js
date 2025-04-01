export default {
  namespaced: true,
  state: {
    points: []
  },
  mutations: {
    SET_POINTS(state, points) {
      state.points = points
    }
  },
  actions: {
    initializePoints({ commit }, pointsData) {
      commit('SET_POINTS', pointsData)
    }
  },
  getters: {
    allPoints: state => state.points || []
  }
}