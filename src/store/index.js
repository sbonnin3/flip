import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import commandes from './modules/commandes';
import tournois from './modules/tournois';
import jeux from './modules/jeux';
import stands from './modules/stands';
import reservations from './modules/reservations';
import souvenirs from './modules/souvenirs';
import points from './modules/points'
import comments from './modules/comments';
import order from './modules/order';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    commandes,
    tournois,
    jeux,
    stands,
    reservations,
    points,
    souvenirs,
    comments,
    order,
  }
});
