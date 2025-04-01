import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import commandes from './modules/commandes';
import comptes from './modules/comptes';
import jeux from './modules/jeux';
import panier from './modules/panier';
import reservations from './modules/reservations';
import restaurants from './modules/restaurants';
import souvenirs from './modules/souvenirs';
import tournois from './modules/tournois';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    commandes,
    comptes,
    jeux,
    panier,
    reservations,
    restaurants,
    souvenirs,
    tournois
  }
});