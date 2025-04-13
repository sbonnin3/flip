import {getPrestataireService, createPrestataireFromAPI, getTypePrestataireService, updatePrestataireService} from "@/services/serviceapi/prestataire";

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
      UPDATE_STAND(state, stand) {
            const index = state.stands.findIndex(s => s.idStand === stand.idStand);
            if (index !== -1) {
                state.stands.splice(index, 1, stand);
            }
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
      },
      async updateStand({commit}, { id, data }) {
            console.log("STORE: update stand")
            let result = null
            try {
                result = await updatePrestataireService(id, data)
                commit('UPDATE_STAND',result)
                console.log(JSON.stringify(result))
            }
            catch(err) {
                console.log("Cas anormal dans updateStand()")
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