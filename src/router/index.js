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

// Ajout de la logique de redirection pour les prestataires
router.beforeEach((to, from, next) => {
  const user = store.getters.userSession;

  // Si l'utilisateur n'est pas connecté et que la route nécessite une authentification
  if (to.meta.requiresAuth && !user) {
    return next('/Connexion');
  }

  if (to.meta.requiresPrestataire && !["restaurateur", "vendeur", "createur", "organisateur"].includes(user.role)) {
    return next('/Accueil');
  }  

  // Redirection pour les prestataires sur la page Carte
  if (to.path === '/Carte' && user && ["restaurateur", "vendeur", "createur", "organisateur"].includes(user.role)) {
    return next('/PrestatairesCarte'); // Redirige les prestataires vers leur propre carte
  }

  // Vérification si la route nécessite des droits administratifs
  if (to.meta.requiresAdmin && (!user || user.role !== 'administrateur')) {
    return next('/');
  }

  // Vérification si l'utilisateur doit être un organisateur
  if (to.matched.some(record => record.meta.requiresOrganizer) && user.role !== 'organisateur') {
    return next('/Accueil');
  }

  // Vérification si la route est réservée aux prestataires
  if (to.meta.requiresPrestataire && !["restaurateur", "vendeur", "createur", "organisateur"].includes(user.role)) {
    return next('/Accueil');
  }

  next();
});

export default router;