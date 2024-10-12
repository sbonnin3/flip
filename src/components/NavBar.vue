<template>
  <div class="navbar-container">
    <nav
      class="navbar"
      :class="{ 'navbar-transparent': !isScrolled && isOnHomePage, 'navbar-visible': isScrolled || !isOnHomePage }"
    >
      <div class="nav-titles">
        <img src="../assets/images/logo.png" alt="logo" width="100px" height="80px" />
        <p
          v-for="(title, index) in displayedTitles"
          :key="index"
          :style="{ color: title.color }"
          @click="emitMenuClicked(index)"
          class="nav-item"
        >
          {{ title.text }}
        </p>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    titles: {
      type: Array,
      required: true,
    },
    userSession: {
      type: Object,
      default: null, // Par défaut, l'utilisateur n'est pas connecté
    },
  },
  data() {
    return {
      isScrolled: false, // Indicateur pour suivre si la page est défilée
      isOnHomePage: false, // Indicateur pour savoir si l'utilisateur est sur la page d'accueil
    };
  },
  computed: {
    // Afficher dynamiquement les titres en fonction de l'état de connexion
    displayedTitles() {
      return this.titles.map((title, index) => {
        // Remplace l'onglet Connexion par Mon Compte si l'utilisateur est connecté
        if (index === 4 && this.userSession) {
          return { ...title, text: "Mon Compte" };
        }
        return title;
      });
    },
  },
  mounted() {
    this.checkIfOnHomePage(); // Vérifier si on est sur la page d'accueil lors du montage
    this.startScrollListener(); // Activer l'écouteur de défilement
  },
  beforeDestroy() {
    this.stopScrollListener(); // Supprimer l'écouteur avant de détruire le composant
  },
  watch: {
    // Surveiller les changements de la route pour mettre à jour la navbar
    $route() {
      this.checkIfOnHomePage(); // Vérifier si l'utilisateur est sur la page d'accueil à chaque changement de route
    },
  },
  methods: {
    // Vérifie si l'utilisateur est sur la page d'accueil
    checkIfOnHomePage() {
      this.isOnHomePage = this.$route.path === "/Accueil";
      this.isScrolled = !this.isOnHomePage; // Forcer la barre visible par défaut si pas sur la page d'accueil
    },
    // Méthode pour mettre à jour l'état `isScrolled` en fonction du défilement de la page
    handleScroll() {
      this.isScrolled = window.scrollY > 0; // Si le scroll est supérieur à 0, la barre de navigation devient visible
    },
    // Activer l'écouteur de défilement
    startScrollListener() {
      window.addEventListener("scroll", this.handleScroll);
    },
    // Désactiver l'écouteur de défilement
    stopScrollListener() {
      window.removeEventListener("scroll", this.handleScroll);
    },
    // Méthode pour émettre l'événement de menu cliqué
    emitMenuClicked(index) {
      this.$emit("menu-clicked", index);
    },
  },
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 5px 20px;
  box-shadow: 0 6px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  height: 80px;
  transition: background-color 0.40s ease-in-out; /* Transition douce entre les styles */
}

/* Styles pour la navbar transparente */
.navbar-transparent {
  background-color: transparent; /* Transparent lorsque `isScrolled` est faux */
  box-shadow: none; /* Supprimer l'ombre */
}

.navbar-transparent p.nav-item {
  color: white;
  text-shadow: black 0px 0px 5px;
}

/* Styles pour la navbar visible */
.navbar-visible {
  background-color: #ffffff; /* Background par défaut lorsqu'on descend la page */
  box-shadow: 0 6px 4px rgba(0, 0, 0, 0.1); /* Ajoute une ombre pour la visibilité */
}

/* Styles des titres dans la navbar */
.nav-titles {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  margin-left: 50px;
}

/* Styles des éléments de navigation */
p.nav-item {
  margin-top: 10px;
  margin-left: 60px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  position: relative;
  transition: transform 0.3s ease, color 0.3s ease, text-shadow 0.3s ease;
  color: black;
}

/* Effet hover pour les éléments de navigation */
p.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: red;
  transition: width 0.3s ease;
}

p.nav-item:hover::after {
  width: 100%;
}

p.nav-item:hover {
  color: #ff6f61;
  transform: scale(1.1);
}
</style>
