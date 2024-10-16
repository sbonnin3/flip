import Vue from 'vue';
import VueRouter from 'vue-router';
import Accueil from '../views/Accueil.vue';
import Activites from '../views/Activites.vue';
import Carte from '../views/Carte.vue';
import Prestataires from '../views/Prestataires.vue';
import Connexion from '../views/Connexion.vue';
import MonCompte from '../views/MonCompte.vue';
import MesCommandes from '../views/MesCommandes.vue';
import store from '../store/index.js';

Vue.use(VueRouter);

const routes = [
  {
    path: "/Accueil",
    name: "Accueil",
    component: Accueil,
  },
  {
    path: "/Activites",
    name: "Activites",
    component: Activites,
  },
  {
    path: "/Carte",
    name: "Carte",
    component: Carte,
  },
  {
    path: "/Prestataires",
    name: "Prestataires",
    component: Prestataires,
  },
  {
    path: "/Connexion",
    name: "Connexion",
    component: Connexion,
  },
  {
    path: "/MonCompte",
    name: "MonCompte",
    component: MonCompte,
    meta: { requiresAuth: true },
  },
  {
    path: "/MesCommandes",
    name: "MesCommandes",
    component: MesCommandes,
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    redirect: "/Accueil",
  },
  {
    path: "*",
    redirect: "/Accueil",
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.userSession) {
      next({
        path: '/Connexion',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
