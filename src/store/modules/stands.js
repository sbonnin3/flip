import {getPrestataireService} from "@/services/serviceapi/prestataire";

export default {
  namespaced: true,
  state: {
      stands: []
  },
  mutations: {
      SET_STANDS(state, stands) {
          state.stands = stands;
      }
  },
  actions: {
      async getAllStands({commit}) {
          console.log("STORE: get all prestataires")
          let result = null
          try {

              result = await getPrestataireService()
                  commit('SET_STANDS',result)
                  console.log(result)
          }
          catch(err) {
              console.log("Cas anormal dans getAllPrestataires()")
          }
      },
  },
  getters: {
      stands: state => state.stands || [],
      getStandById: (state) => (id) => {
          return state.stands.find(stand => stand.idStand === id);
      }
  }
};