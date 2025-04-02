<template>
  <div class="navbar-container">
    <nav class="navbar"
         :class="{ 'navbar-transparent': !isScrolled && isOnHomePage, 'navbar-visible': isScrolled || !isOnHomePage }">
      <div class="nav-titles">
        <img src="../assets/images/logo.png" alt="logo" width="100px" height="80px" />
        <p v-for="(title, index) in displayedTitles" :key="index" :style="{ color: title.color }"
           @click="emitMenuClicked(index)" :class="['nav-item', { active: activeIndex === index }]">
          {{ $t(title.text) }}
        </p>
        <button
            class="language-switcher"
            @click="switchLanguage"
            :class="{ 'navbar-transparent': !isScrolled && isOnHomePage }"
        >
          {{ currentLanguage }}
        </button>
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
      default: null,
    },
  },
  data() {
    return {
      isScrolled: false,
      isOnHomePage: false,
    };
  },
  computed: {
    currentLanguage() {
      return this.$i18n.locale.toUpperCase();
    },
    displayedTitles() {
      let modifiedTitles = [...this.titles];
      if (this.userSession && this.userSession.role === 'administrateur') {
        const comptesIndex = modifiedTitles.findIndex(title => title.text === 'Comptes');
        if (comptesIndex === -1) {
          modifiedTitles.push({text: 'Comptes', color: 'black'});
        }
      }

      return modifiedTitles;
    },
    activeIndex() {
      const currentPath = this.$route.path.toLowerCase();
      return this.displayedTitles.findIndex(title => {
        const titleToPathMap = {
          "Accueil": "/Accueil",
          "Carte": this.userSession && ["restaurateur", "vendeur", "createur", "organisateur"].includes(this.userSession.role)
              ? "/PrestatairesCarte"
              : "/Carte",
          "Activités": "/Activites",
          "Réservations": "/Reservations",
          "Mon Compte": "/MonCompte",
          "Connexion": "/Connexion",
          "Comptes": "/Comptes",
          "Produits": "/Produits",
          "Statistiques": "/Statistiques",
          "Ma Prestation": "/MaPrestation",
          "Commandes": "/Commandes",
          "Ventes": "/CommandesBoutique",
          "Mes réservations": "/MesReservations"
        };
        return titleToPathMap[title.text]?.toLowerCase() === currentPath;
      });
    },
  },
  mounted() {
    this.checkIfOnHomePage();
    this.startScrollListener();
  },
  beforeDestroy() {
    this.stopScrollListener();
  },
  watch: {
    $route() {
      this.checkIfOnHomePage();
    },
  },
  methods: {
    switchLanguage() {
      const newLang = this.$i18n.locale === 'fr' ? 'en' : 'fr';
      this.$i18n.locale = newLang;
      localStorage.setItem('userLanguage', newLang);
      location.reload(); // Pour s'assurer que tout se recharge avec la nouvelle langue
    },
    checkIfOnHomePage() {
      this.isOnHomePage = this.$route.path === "/Accueil" || this.$route.path === "/Connexion" || this.$route.path === "/MonCompte";
      this.isScrolled = !this.isOnHomePage;
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 0;
    },
    startScrollListener() {
      window.addEventListener("scroll", this.handleScroll);
    },
    stopScrollListener() {
      window.removeEventListener("scroll", this.handleScroll);
    },
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
  z-index: 5000;
  height: 80px;
  transition: background-color 0.40s ease-in-out;
}

.navbar-transparent {
  background-color: transparent;
  box-shadow: none;
}

.navbar-transparent p.nav-item {
  color: white;
  text-shadow: black 0px 0px 5px;
}

.navbar-visible {
  background-color: #ffffff;
  box-shadow: 0 6px 4px rgba(0, 0, 0, 0.1);
}

.navbar-visible p.nav-item {
  color: black;
}

.navbar-visible p.nav-item:hover {
  color: black;
}

.nav-titles {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  margin-left: 50px;
}

p.nav-item {
  margin-top: 10px;
  margin-left: 60px;
  cursor: pointer;
  font-size: 15px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  position: relative;
  transition: transform 0.3s ease, color 0.3s ease, text-shadow 0.3s ease;
  color: black;
}

p.nav-item.active {
  color: black;
  transform: scale(1.1);
  font-weight: bold;
}

.navbar-transparent p.nav-item.active {
  color: white;
}

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
  color: white;
  transform: scale(1.1);
  font-weight: bold;
}

.language-switcher {
  cursor: pointer;
  font-size: 15px;
  text-transform: uppercase;
  background: none;
  border: none;
  padding: 0;
  bottom: 2px;
  margin-left: 60px;
  color: black;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
}

.navbar-transparent .language-switcher {
  color: white;
  text-shadow: black 0px 0px 5px;
}

.language-switcher:hover {
  transform: scale(1.1);
  font-weight: bold;
}

.language-switcher::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: red;
  transition: width 0.3s ease;
}

.language-switcher:hover::after {
  width: 100%;
}
</style>