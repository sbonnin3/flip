<template>
  <div class="navbar-container">
    <nav class="navbar"
      :class="{ 'navbar-transparent': !isScrolled && isOnHomePage, 'navbar-visible': isScrolled || !isOnHomePage }">
      <div class="nav-titles">
        <img src="../assets/images/logo.png" alt="logo" width="100px" height="80px" />
        <p v-for="(title, index) in displayedTitles" :key="index" :style="{ color: title.color }"
          @click="emitMenuClicked(index)" class="nav-item">
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
    displayedTitles() {
      return this.titles.map((title, index) => {
        if (index === 4 && this.userSession) {
          return { ...title };
        }
        return title;
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
    checkIfOnHomePage() {
      this.isOnHomePage = this.$route.path === "/Accueil";
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
  z-index: 1000;
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
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  position: relative;
  transition: transform 0.3s ease, color 0.3s ease, text-shadow 0.3s ease;
  color: black;
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
  color: #ff6f61;
  transform: scale(1.1);
}
</style>
