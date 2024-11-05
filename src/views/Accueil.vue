<template>
  <div class="accueilpage">
    <div class="introduction-container">
      <div class="text-container" :class="{ 'fade-in-text': fadeText, 'fade-out-text': !fadeText }">
        <h1>{{ currentSlide.title }}</h1>
        <h3>{{ currentSlide.subtitle }}</h3>
      </div>
    </div>
    <h1 class="midh1">Pourquoi venir au FLIP ?</h1>
    <div class="up-container">
      <div class="leftuptextcontainer" :class="{ 'fade-in': fadeText }">
        <h1>{{ currentCarouselSlide.title }}</h1>
        <h3>{{ currentCarouselSlide.subtitle }}</h3>
        <h5>{{ currentCarouselSlide.description }}</h5>
        <button type="submit" class="login-button">En savoir plus</button>
      </div>
      <img class="festivalimages" :class="{ 'slide-in': fadeImage }" :src="currentCarouselSlide.image"
        alt="imagefestival">
    </div>

    <div class="carousel-indicators">
      <span v-for="(slide, index) in carouselSlides" :key="index" :class="{ active: currentCarouselIndex === index }"
        class="indicator"></span>
    </div>

    <h1 class="down-container-title">Interessé ? plus d'informations qui vous donneront encore plus envie !</h1>
    <h3 class="down-container-uptitle">Lorem ipsum supreme</h3>
    <div class="down-container">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
        aute irure
        dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <img src="../assets/images/backgroundaccueil_3.jpg" width="470" height="310" class="down-container-image1">
    </div>
    <h3 class="down-container-uptitleright">Lorem ipsum supreme</h3>
    <div class="down-containertwo">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
        aute irure
        dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <img src="../assets/images/backgroundaccueil_3.jpg" width="470" height="310" class="down-container-image1">
    </div>
    <h3 class="down-container-uptitle">Lorem ipsum supreme</h3>
    <div class="down-container">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
        aute irure
        dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <img src="../assets/images/backgroundaccueil_3.jpg" width="470" height="310" class="down-container-image1">
    </div>


  </div>
</template>

<script>
export default {
  name: "PageAccueil",
  data() {
    return {
      currentIndex: 0,
      currentCarouselIndex: 0,
      fadeText: true,
      fadeImage: true,
      slides: [
        {
          title: "Festival International de Parthenay",
          subtitle: "Le plus grand festival de jeux en plein air",
        },
        {
          title: "Plus de 30 ans d'existence",
          subtitle: "Un événement culturel et ludique unique",
        },
        {
          title: "Jeux pour tous les âges",
          subtitle: "Du 9 au 20 juillet 2025 à Parthenay",
        },
        {
          title: "35 000 m² d'animation en ville",
          subtitle: "Avec des animateurs passionnés pour guider",
        },
      ],
      carouselSlides: [
        {
          title: "Festival des Jeux de Parthenay - FLIP",
          subtitle: "Le plus grand festival de jeux gratuit",
          description: "Présent depuis 1986",
          image: require("../assets/images/imagefestival_1.png"),
        },
        {
          title: "Plus de 350 animateurs jeux",
          subtitle: "4 000 jeux et jouets",
          description: "4 000 places assises",
          image: require("../assets/images/imagefestival_2.png"),
        },
        {
          title: "Présent tous les ans sans exception",
          subtitle: "Du 9 au 20 juillet 2025",
          description: "Le tout gratuit",
          image: require("../assets/images/imagefestival_3.png"),
        },
      ],
    };
  },
  mounted() {
    this.startTextTransition();
    this.startCarouselTransition();
  },
  methods: {
    startTextTransition() {
      setInterval(() => {
        this.fadeText = false;

        setTimeout(() => {
          this.currentIndex = (this.currentIndex + 1) % this.slides.length;
          this.fadeText = true;
        }, 1000);
      }, 4000);
    },
    startCarouselTransition() {
      setInterval(() => {
        this.fadeImage = false;

        setTimeout(() => {
          this.currentCarouselIndex = (this.currentCarouselIndex + 1) % this.carouselSlides.length;
          this.fadeImage = true;
        }, 1000);
      }, 4000);
    },
  },
  computed: {
    currentSlide() {
      return this.slides[this.currentIndex];
    },
    currentCarouselSlide() {
      return this.carouselSlides[this.currentCarouselIndex];
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.accueilpage {
  padding-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.introduction-container {
  width: 100%;
  height: 920px;
  background-image: url("../assets/images/backgroundaccueil.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}

.text-container {
  position: absolute;
  left: 50px;
  padding: 20px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 1s ease-in-out, transform 1s ease-in-out;
}

.text-container.fade-in-text {
  opacity: 1;
  transform: translateY(0);
}

.text-container.fade-out-text {
  opacity: 0;
  transform: translateY(20px);
}

.text-container h1 {
  margin-bottom: 20px;
  font-size: 50px;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
}

.text-container h3 {
  padding-top: 10px;
  font-size: 40px;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
}

.up-container {
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.leftuptextcontainer {
  text-align: left;
  padding-left: 100px;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  color: black;
}

.leftuptextcontainer.fade-in {
  opacity: 1;
}

.festivalimages {
  margin-right: 80px;
  height: 450px;
  width: 650px;
  margin-top: 30px;
  margin-bottom: 30px;
  transform: translateX(100%);
  opacity: 1;
  transition: transform 1s ease-in-out, opacity 1s ease-in-out;
}

.festivalimages.slide-in {
  transform: translateX(0);
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.indicator {
  width: 10px;
  height: 10px;
  margin: 0 5px;
  border-radius: 50%;
  background-color: #ddd;
}

.indicator.active {
  background-color: #007bff;
}

button {
  width: 150px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.midh1 {
  border-bottom: red solid 4px;
  color: black;
  padding-top: 30px;
  padding-bottom: 10px;
}

.down-container {
  display: flex;
}

.down-container p,
img {
  padding-right: 50px;
  padding-left: 80px;
  color: black;
}

.down-container p {
  width: 45%;
  line-height: 1.6;
  margin-left: 90px;
  text-align: justify;
  font-size: 18px;
}

.down-container img {
  width: 31%;
  margin-right: 65px;
  margin-top: 20px;
}

.down-container-title {
  color: white;
  margin-top: 75px;
  padding: 75px;
  width: 80%;
  background-color: black;
  text-shadow: 2px 2px 4px rgba(128, 128, 128, 0.7);
}

.down-container-uptitle {
  color: black;
  padding: 3px;
  margin-left: 170px;
  margin-right: auto;
  text-shadow: 2px 2px 4px rgba(128, 128, 128, 0.7);
  border-bottom: red solid 4px;
}

.down-containertwo {
  display: flex;
  margin-bottom: 150px;
}

.down-containertwo p,
img {
  padding-right: 50px;
  padding-left: 80px;
}

.down-containertwo img {
  width: 31%;
  margin-left: 90px;
  margin-top: 20px;
  margin-right: auto;
  position: absolute;
}

.down-containertwo p {
  color: black;
  width: 45%;
  text-align: justify;
  font-size: 18px;
  margin-right: 65px;
  line-height: 1.6;
  margin-left: auto;
}

.down-container-uptitleright {
  color: black;
  margin-left: auto;
  margin-right: 120px;
  margin-top: 50px;
  text-shadow: 2px 2px 4px rgba(128, 128, 128, 0.7);
  border-bottom: red solid 4px;
}
</style>