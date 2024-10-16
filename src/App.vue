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
      navTitles: [
        { text: "Accueil" },
        { text: "Activités" },
        { text: "Carte" },
        { text: "Prestataires" },
      ],
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
        { text: "Activités" },
        { text: "Carte" },
        { text: "Prestataires" },
      ];

      if (this.userSession && this.userSession.role === 'utilisateur') {
        this.navTitles.push({ text: "Mes Commandes" });
        this.navTitles.push({ text: "Mon Compte" });
      } else if (this.userSession) {
        this.navTitles.push({ text: "Mon Compte" });
      } else {
        this.navTitles.push({ text: "Connexion" });
      }
    },
    handleMenuClick(index) {
      let route = "";
      if (index === 0) {
        route = "/Accueil";
      } else if (index === 1) {
        route = "/Activites";
      } else if (index === 2) {
        route = "/Carte";
      } else if (index === 3) {
        route = "/Prestataires";
      } else if (index === 4 && this.userSession && this.userSession.role === 'utilisateur') {
        route = "/MesCommandes";
      } else if (index === 4 || (index === 5 && this.userSession)) {
        route = this.userSession ? "/MonCompte" : "/Connexion";
      }

      if (this.$route.path !== route) {
        this.$router.push(route);
      }
    },
  },
  mounted() {
    this.updateNavTitles();
  },
};
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
  padding-bottom: 20px;
}

body {
  width: 100vw;
  overflow-x: hidden;
}
</style>