<template>
  <div id="app">
    <NavBar :titles="navTitles" :userSession="userSession" @menu-clicked="handleMenuClick" />
    <router-view></router-view>
  </div>
</template>

<script>
import {mapState} from "vuex";
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
    ...mapState("user", {
      userSession: "actualUser"
    }),
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
        if (["vendeur", "restaurateur", "createur", "organisateur"].includes(this.userSession.role.toLowerCase())) {
          this.navTitles = this.navTitles.filter(title => title.text !== "Produits");
        }
        if (this.userSession.role === "utilisateur") {
          this.navTitles.push({ text: "Mes Commandes" });
        }
        if (this.userSession.role === "organisateur") {
          this.navTitles.push({ text: "Réservations" });
        }
        if (["restaurateur", "createur", "organisateur"].includes(this.userSession.role)) {
          this.navTitles.push({ text: "Ma Prestation" });
        }
        if (this.userSession.role === "restaurateur") {
          this.navTitles.push({ text: "Commandes" });
        }
        if (this.userSession.role === "vendeur") {
          this.navTitles.push({ text: "Ventes" });
        }
        if (this.userSession.role === "createur") {
          this.navTitles.push({ text: "Mes réservations" });
        }
        this.navTitles.push({ text: "Statistiques" });

        this.navTitles.push({ text: "Mon Compte" });

        if (!["restaurateur", "vendeur", "createur", "organisateur"].includes(this.userSession.role)) {
          this.navTitles.splice(1, 0, { text: "Activités" });
        }

        if (this.userSession.role.toLowerCase() === "administrateur") {
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

      if (this.navTitles[index].text === "Statistiques") {
        route = "/Statistiques";
      } else if (this.navTitles[index].text === "Carte" && this.userSession && ["restaurateur", "vendeur", "createur", "organisateur"].includes(this.userSession.role)) {
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
      } else if (this.navTitles[index].text === "Commandes") {
        route = "/Commandes";
      } else if (this.navTitles[index].text === "Ventes") {
        route = "/CommandesBoutique";
      } else if (this.navTitles[index].text === "Mes réservations") {
        route = "/MesReservations";
      }

      if (this.$route.path !== route) {
        this.$router.push(route);
      }
    },
    mounted() {
      this.updateNavTitles();
    },
    created() {
      this.$store.dispatch('loadRestaurants');
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