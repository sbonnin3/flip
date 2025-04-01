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

// ... (les imports restent les mêmes)

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
  const user = store.getters['user/userSession']; // Accès correct au module namespaced
  
  // 1. Gestion spécifique de la route /Connexion
  if (to.path === '/Connexion') {
    // Si déjà connecté, rediriger vers MonCompte
    if (user) {
      return next('/MonCompte');
    }
    return next(); // Laisser passer si non connecté
  }

  // 2. Vérification des routes protégées
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!user) {
      // Stocker la route demandée seulement si on ne vient pas déjà de la connexion
      if (from.path !== '/Connexion') {
        store.dispatch('user/setRedirectPath', to.fullPath); // Utilisation du fullPath
      }
      return next('/Connexion');
    }
    
    // Vérifications des rôles spécifiques
    if (to.meta.requiresAdmin && user.role !== 'administrateur') {
      return next('/Accueil');
    }
    
    if (to.matched.some(record => record.meta.requiresOrganizer) && user.role !== 'organisateur') {
      return next('/Accueil');
    }
    
    if (to.meta.requiresPrestataire && !["restaurateur", "vendeur", "createur", "organisateur"].includes(user.role)) {
      return next('/Accueil');
    }
  }

  // 3. Redirection spéciale pour la carte des prestataires
  if (to.path === '/Carte' && user?.role && ["restaurateur", "vendeur", "createur", "organisateur"].includes(user.role)) {
    return next('/PrestatairesCarte');
  }

  // 4. Cas par défaut - laisser passer
  next();
});

export default router;