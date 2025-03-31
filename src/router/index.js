import Vue from 'vue';
import VueRouter from 'vue-router';
import Accueil from '../views/Accueil.vue';
import Activites from '../views/Activites.vue';
import Carte from '../views/Carte.vue';
import Produits from '../views/Produits.vue';
import Connexion from '../views/Connexion.vue';
import MonCompte from '../views/MonCompte.vue';
import MesCommandes from '../views/MesCommandes.vue';
import Reservations from '../views/Reservations.vue';
import PrestatairesCarte from '../views/PrestatairesCarte.vue';
import MaPrestation from '../views/MaPrestation.vue';
import Commandes from '../views/Commandes.vue';
import Statistiques from '../views/Statistiques.vue';
import store from '../store/index.js';
import CommandesBoutique from "../views/CommandesBoutique.vue";
import MesReservations from "../views/MesReservations.vue";

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
    path: "/Produits",
    name: "Produits",
    component: Produits,
  },
  { path: '/Connexion', component: Connexion },
  { path: '/MonCompte', component: MonCompte, meta: { requiresAuth: true } },
  {
    path: "/MesCommandes",
    name: "MesCommandes",
    component: MesCommandes,
    meta: { requiresAuth: true },
  },
  {
    path: "/Reservations",
    name: "Reservations",
    component: Reservations,
    meta: { requiresAuth: true, requiresOrganizer: true },
  },
  {
    path: "/MaPrestation",
    name: "MaPrestation",
    component: MaPrestation,
    meta: { requiresAuth: true, requiresPrestataire: true }
  },
  {
    path: "/Commandes",
    name: "Commandes",
    component: Commandes,
    meta: { requiresAuth: true, requiresPrestataire: true }
  },
  {
    path: "/CommandesBoutique",
    name: "Ventes",
    component: CommandesBoutique,
    meta: { requiresAuth: true, requiresPrestataire: true }
  },
  {
    path: "/MesReservations",
    name: "MesReservations",
    component: MesReservations,
    meta: { requiresAuth: true, requiresPrestataire: true }
  },
  {
    path: '/PrestatairesCarte',
    name: 'PrestatairesCarte',
    component: PrestatairesCarte,
    meta: { requiresAuth: true, requiresPrestataire: true }
  },
  {
    path: '/Comptes',
    name: 'AdminComptes',
    component: () => import('@/views/AdminComptesView'),
    meta: { requiresAdmin: true }
  },
  {
    path: "/Statistiques",
    name: "Statistiques",
    component: Statistiques,
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

router.beforeEach(async (to, from, next) => {
  // Initialise le store user si nécessaire
  if (!store.getters['user/userSession'] && (!store.state.user.comptes || store.state.user.comptes.length === 0)) {
    await store.dispatch('user/initComptes');
  }

  const user = store.getters['user/userSession'];
  console.log('Navigation guard - User:', user); // Debug
  
  // Vérifie l'authentification
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!user) {
      console.log('Redirection vers Connexion (non authentifié)');
      return next({
        path: '/Connexion',
        query: { redirect: to.fullPath }
      });
    }
  }

  // Vérifie les rôles spécifiques
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!user || user.role !== 'administrateur') {
      console.log('Accès refusé - Admin required');
      return next('/Accueil');
    }
  }

  if (to.matched.some(record => record.meta.requiresOrganizer)) {
    if (!user || user.role !== 'organisateur') {
      console.log('Accès refusé - Organisateur required');
      return next('/Accueil');
    }
  }

  if (to.matched.some(record => record.meta.requiresPrestataire)) {
    const prestataireRoles = ['restaurateur', 'vendeur', 'createur', 'organisateur'];
    if (!user || !prestataireRoles.includes(user.role)) {
      console.log('Accès refusé - Prestataire required');
      return next('/Accueil');
    }
  }

  // Gestion spéciale de la route /Carte pour les prestataires
  if (to.path === '/Carte' && user && ['restaurateur', 'vendeur', 'createur', 'organisateur'].includes(user.role)) {
    console.log('Redirection prestataire vers PrestatairesCarte');
    return next('/PrestatairesCarte');
  }

  next();
});

export default router;