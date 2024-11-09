<template>
  <div id="app">
    <NavBar :titles="navTitles" :userSession="userSession" @menu-clicked="handleMenuClick" />
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import NavBar from "@/components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
  data() {
    return {
      navTitles: [],
    };
  },
  computed: {
    ...mapGetters(["userSession"]),
  },
  watch: {
    userSession: {
      handler() {
        this.updateNavTitles();
      },
      immediate: true,
    },
  },
  methods: {
    updateNavTitles() {
  this.navTitles = [
    { text: "Accueil" },
    { text: "Carte" },
    { text: "Produits" }
  ];

  if (this.userSession) {
    // Ajouter "Mes Commandes" pour les utilisateurs réguliers (non-prestataires)
    if (this.userSession.role === "utilisateur") {
      this.navTitles.push({ text: "Mes Commandes" });
    }

    // Ajouter "Réservations" pour les organisateurs
    if (this.userSession.role === "organisateur") {
      this.navTitles.push({ text: "Réservations" });
    }

    // Ajouter "Ma Prestation" pour les prestataires
    if (["restaurateur", "vendeur", "createur", "organisateur"].includes(this.userSession.role)) {
      this.navTitles.push({ text: "Ma Prestation" });
    }

    // Ajouter "Mon Compte"
    this.navTitles.push({ text: "Mon Compte" });

    // Ajouter "Activités" pour les utilisateurs non-prestataires
    if (!["restaurateur", "vendeur", "createur", "organisateur"].includes(this.userSession.role)) {
      this.navTitles.splice(1, 0, { text: "Activités" });
    }

    // Ajouter "Comptes" pour les administrateurs
    if (this.userSession.role === "administrateur") {
      const comptesIndex = this.navTitles.findIndex(title => title.text === 'Comptes');
      if (comptesIndex === -1) {
        this.navTitles.push({ text: "Comptes" });
      }
    }
  } else {
    this.navTitles.push({ text: "Connexion" });
    this.navTitles.splice(1, 0, { text: "Activités" });
  }
},
handleMenuClick(index) {
  let route = "";

  if (this.navTitles[index].text === "Carte" && this.userSession && ["restaurateur", "vendeur", "createur", "organisateur"].includes(this.userSession.role)) {
    route = "/PrestatairesCarte";
  } else if (this.navTitles[index].text === "Carte") {
    route = "/Carte";
  } else if (this.navTitles[index].text === "Accueil") {
    route = "/Accueil";
  } else if (this.navTitles[index].text === "Activités") {
    route = "/Activites";
  } else if (this.navTitles[index].text === "Produits") {
    route = "/Produits";
  } else if (this.navTitles[index].text === "Réservations") {
    route = "/Reservations";
  } else if (this.navTitles[index].text === "Mon Compte") {
    route = "/MonCompte";
  } else if (this.navTitles[index].text === "Connexion") {
    route = "/Connexion";
  } else if (this.navTitles[index].text === "Comptes") {
    route = "/Comptes";
  } else if (this.navTitles[index].text === "Mes Commandes") {
    route = "/MesCommandes";
  } else if (this.navTitles[index].text === "Ma Prestation") {
    route = "/MaPrestation";
  }

  if (this.$route.path !== route) {
    this.$router.push(route);
  }
},
    mounted() {
      this.updateNavTitles();
    },
  }
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  background-color: #ffffff;
  min-height: 100vh;
}

body {
  width: 100vw;
  overflow-x: hidden;
}
</style>