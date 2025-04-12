import {getPrestataireService, createPrestataireFromAPI, getTypePrestataireService} from "@/services/serviceapi/prestataire";

export default {
  namespaced: true,
  state: {
      stands: [],
      typeStands: [],
  },
  mutations: {
      SET_STANDS(state, stands) {
          state.stands = stands;
      },
      SET_TYPE_STAND(state, typeStand) {
          state.typeStands = typeStand;
      },
        ADD_STAND(state, stand) {
            state.stands.push(stand);
        },
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
      async getAllTypesStand({commit}) {
          console.log("STORE: get all typeStands")
          let result = null
          try {

              result = await getTypePrestataireService()
              commit('SET_TYPE_STAND',result)
              console.log(result)
          }
          catch(err) {
              console.log("Cas anormal dans typeStands()")
          }
      },
      async addStand({commit}, stand) {
            console.log("STORE: add stand")
            let result = null
            try {
                result = await createPrestataireFromAPI(stand)
                commit('ADD_STAND',result)
                console.log(result)
            }
            catch(err) {
                console.log("Cas anormal dans addStand()")
            }
      }
  },
  getters: {
      stands: state => state.stands || [],
      getStandById: (state) => (id) => {
          return state.stands.find(stand => stand.idStand === id);
      }
  }
};