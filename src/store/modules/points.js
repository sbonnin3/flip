export default {
  namespaced: true,
  state: {
    points: []
  },
  mutations: {
    SET_POINTS(state, points) {
      state.points = points.map(point => ({
        ...point,
        coordinates: Array.isArray(point.coordinates) ? 
          [point.coordinates[0], point.coordinates[1]] : 
          [46.648, -0.2494],
        // Assurer que 'disponible' est un booléen
        disponible: point.disponible !== false
      }));
    },
    UPDATE_POINT(state, { pointId, changes }) {
      const index = state.points.findIndex(p => p.idPoint === pointId);
      if (index !== -1) {
        state.points[index] = { 
          ...state.points[index], 
          ...changes,
          // Forcer la mise à jour de la réactivité
          coordinates: [...state.points[index].coordinates]
        };
      }
    }
  },
  actions: {
    async initializePoints({ commit, rootState }) {
      try {
        const { points } = await import('@/datasource/data.js');
        const stands = rootState.restaurants.stands || [];
        
        // Marquer comme indisponibles les points utilisés par des stands
        const updatedPoints = points.map(point => {
          if (point.category === 'Emplacement') {
            const isUsed = stands.some(stand => stand.idPoint === point.idPoint);
            return { ...point, disponible: !isUsed };
          }
          return point;
        });
        
        commit('SET_POINTS', updatedPoints);
      } catch (error) {
        console.error("Failed to load points:", error);
        commit('SET_POINTS', []);
      }
    },
    async updatePointAvailability({ commit, dispatch }, { pointId, isAvailable }) {
      commit('UPDATE_POINT', {
        pointId,
        changes: { disponible: isAvailable }
      });
      // Recharger les stands pour s'assurer que tout est synchronisé
      await dispatch('restaurants/initializeRestaurants', null, { root: true });
    }
  },
  getters: {
    availablePoints: state => state.points.filter(p => 
      p.category === 'Emplacement' && p.disponible === true
    ),
    allPoints: state => state.points
  }
}