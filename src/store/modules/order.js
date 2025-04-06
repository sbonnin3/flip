import {addProductToBasketService, getBasketByUserIdService} from "@/services/serviceapi/basket.service";


export default {
    namespaced: true,
    state: {
        jeuxAchetes: [],
        actualBasket: [],
    },
    mutations: {
        SET_JEUX_ACHETES(state, jeuxAchetes) {
            state.jeuxAchetes = jeuxAchetes;
        },
        SET_ACTUAL_BASKET(state, actualBasket) {
            state.actualBasket = actualBasket;
        }
    },
    actions: {
        async addProductToBasket({commit}, addData) {
            console.log("STORE: ajout jeux au basket")
            let result = null
            try {
                result = await addProductToBasketService(addData)
                console.log("TEST DAJOUT PRODUIT:" + JSON.stringify(addData))
                commit('SET_JEUX_ACHETES', result)
            } catch (err) {
                console.log("Cas anormal dans addProductToBasketService()")
            }
        },
        async getBasketFromUserId({commit}, userId) {
            console.log("STORE: get basket from userId")
            let result = null
            try {
                result = await getBasketByUserIdService(userId)
                commit('SET_ACTUAL_BASKET', result)
                console.log(result)
            } catch (err) {
                console.log("Cas anormal dans getBasketFromUserId()")
            }
        }
    }

};
