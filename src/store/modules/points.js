export default {
  namespaced: true,
  state: {
    points: []
  },
  mutations: {
    SET_POINTS(state, points) {
      state.points = points.map(point => ({
        ...point,
        // Assurez-vous que les coordonnées sont au format [lat, lng]
        coordinates: Array.isArray(point.coordinates) ? 
          [point.coordinates[0], point.coordinates[1]] : 
          [46.648, -0.2494] // Valeur par défaut
      }));
    },
    UPDATE_POINT(state, { id, changes }) {
      const index = state.points.findIndex(p => p.idPoint === id);
      if (index !== -1) {
        state.points[index] = { ...state.points[index], ...changes };
      }
    }
  },
  actions: {
    async initializePoints({ commit }) {
      try {
        const { points } = await import('@/datasource/data.js');
        commit('SET_POINTS', points);
      } catch (error) {
        console.error("Failed to load points:", error);
        commit('SET_POINTS', []); // Fallback vide
      }
    },
    async updatePointAvailability({ commit }, { pointId, isAvailable }) {
      commit('UPDATE_POINT', {
        id: pointId,
        changes: { disponible: isAvailable }
      });
    }
  },
  getters: {
    availablePoints: state => state.points.filter(p => 
      p.category === 'Emplacement' && p.disponible !== false
    ),
    allPoints: state => state.points
  }
}