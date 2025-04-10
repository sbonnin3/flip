import {getPointsService} from "@/services/serviceapi/points";

export default {
  namespaced: true,
  state: {
    points: []
  },
  mutations: {
    SET_POINT(state, points) {
      state.points = points;
    }
  },
  actions: {
    async getAllPoints({commit}) {
      console.log("STORE: get all points")
      let result = null
      try {

        result = await getPointsService()
        commit('SET_POINT',result)
        console.log(result)
      }
      catch(err) {
        console.log("Cas anormal dans getAllPoints()")
      }
    },
  },
};