import Vue from 'vue'
import VueRouter from 'vue-router'
import Accueil from '../views/Accueil.vue'
import Activites from '../views/Activites.vue'
import Carte from '../views/Carte.vue'
import Produits from '../views/Produits.vue'
import Connexion from '../views/Connexion.vue'
import MonCompte from '../views/MonCompte.vue'
import MesCommandes from '../views/MesCommandes.vue'
import Reservations from '../views/Reservations.vue'
import PrestatairesCarte from '../views/PrestatairesCarte.vue'
import MaPrestation from '../views/MaPrestation.vue'
import Commandes from '../views/Commandes.vue'
import Statistiques from '../views/Statistiques.vue'
import store from '../store/index.js'
import CommandesBoutique from "../views/CommandesBoutique.vue"
import MesReservations from "../views/MesReservations.vue"

Vue.use(VueRouter)

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
    meta: { guest: true }
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
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  if (to.path === from.path) return next(false)

  if (to.meta.guest) {
    if (store.getters['user/isAuthenticated']) {
      const redirect = store.state.user.redirectPath || '/MonCompte'
      store.dispatch('user/clearRedirectPath')
      return next(redirect)
    }
    return next()
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['user/isAuthenticated']) {
      await store.dispatch('user/checkSession')

      if (!store.getters['user/isAuthenticated']) {
        if (from.path !== '/Connexion') {
          store.dispatch('user/setRedirectPath', to.fullPath)
        }
        return next('/Connexion')
      }
    }

    const userRole = store.getters['user/userSession']?.role

    if (to.meta.requiresAdmin && userRole !== 'administrateur') {
      return next('/Accueil')
    }

    if (to.matched.some(record => record.meta.requiresOrganizer) && userRole !== 'organisateur') {
      return next('/Accueil')
    }

    if (to.meta.requiresPrestataire && !["restaurateur", "vendeur", "createur", "organisateur"].includes(userRole)) {
      return next('/Accueil')
    }
  }

  if (to.path === '/Carte' && store.getters['user/isAuthenticated']) {
    const userRole = store.getters['user/userSession']?.role
    if (["restaurateur", "vendeur", "createur", "organisateur"].includes(userRole)) {
      return next('/PrestatairesCarte')
    }
  }

  next()
})

export default router