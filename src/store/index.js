import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import restaurants from './modules/restaurants';
import commandes from './modules/commandes';
import tournois from './modules/tournois';
import jeux from './modules/jeux';
import stands from './modules/stands';
import reservations from './modules/reservations';
import souvenirs from './modules/souvenirs';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    restaurants,
    commandes,
    tournois,
    jeux,
    stands,
    reservations,
    souvenirs
  }
});
