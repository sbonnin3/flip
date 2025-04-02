<template>
  <div class="accueilpage">
    <div class="introduction-container">
      <img class="staticlogo" src="../assets/images/logov2.png" width="800" height="230">
      <div class="text-container" :class="{ 'fade-in-text': fadeText, 'fade-out-text': !fadeText }">
        <h1>{{ $t(currentSlide.titleKey) }}</h1>
        <h3>{{ $t(currentSlide.subtitleKey) }}</h3>
      </div>
    </div>
    <h1 class="midh1">{{ $t('whyAttend') }}</h1>
    <div class="up-container">
      <div class="leftuptextcontainer" :class="{ 'fade-in': fadeText }">
        <h1>{{ $t(currentCarouselSlide.titleKey) }}</h1>
        <h3>{{ $t(currentCarouselSlide.subtitleKey) }}</h3>
        <h5>{{ $t(currentCarouselSlide.descriptionKey) }}</h5>
        <a href="https://www.jeux-festival.com/"><button type="submit" class="more-button">{{ $t('learnMore') }}</button></a>
      </div>
      <img class="festivalimages" :class="{ 'slide-in': fadeImage }" :src="currentCarouselSlide.image"
           alt="imagefestival">
    </div>

    <div class="carousel-indicators">
      <span v-for="(slide, index) in carouselSlides" :key="index" :class="{ active: currentCarouselIndex === index }"
            class="indicator"></span>
    </div>

    <h1 class="down-container-title">{{ $t('moreInfo') }}</h1>
    <div class="content-container">
      <div class="section-one">
        <h2 class="section-title">{{ $t('activitiesTitle') }}</h2>
        <div class="section-content">
          <p class="section-text">{{ $t('activitiesText') }}</p>
        </div>
        <img src="../assets/images/flipgamepicture.jpg" :alt="$t('gamesImageAlt')" class="section-image">
      </div>
      <div class="section-two">
        <h2 class="section-title">{{ $t('shopTitle') }}</h2>
        <div class="section-content">
          <p class="section-text">{{ $t('shopText') }}</p>
        </div>
        <img src="../assets/images/flipshoppicture.jpg" :alt="$t('shopImageAlt')" class="section-image">
      </div>
      <div class="section-three">
        <h2 class="section-title">{{ $t('ecoTitle') }}</h2>
        <div class="section-content">
          <p class="section-text">{{ $t('ecoText') }}</p>
        </div>
        <img src="../assets/images/flipenvironnementpicture.jpg" :alt="$t('ecoImageAlt')" class="section-image">
      </div>
    </div>
    <div class="down-container-up-part">
    </div>
    <h1 class="down-container-mid-part-title">{{ $t('servicesTitle') }}</h1>
    <div class="down-container-mid-part">
      <router-link to="/Produits">
        <figure>
          <img src="../assets/images/burger.jpg" :alt="$t('foodService')" width="280" height="300">
          <figcaption>{{ $t('foodService') }}</figcaption>
        </figure>
      </router-link>

      <a href @click="goToBoutique" class="figure-link">
        <figure>
          <img src="../assets/images/boutique.jpg" :alt="$t('shopService')" width="280" height="300">
          <figcaption>{{ $t('shopService') }}</figcaption>
        </figure>
      </a>

      <router-link to="/Activites">
        <figure style>
          <img src="../assets/images/flipgamepicture.jpg" :alt="$t('gamesService')" width="280" height="300">
          <figcaption>{{ $t('gamesService') }}</figcaption>
        </figure>
      </router-link>

      <a href @click="goToTournois" class="figure-link">
        <figure>
          <img src="../assets/images/tournois_basketball.png" :alt="$t('tournamentsService')" width="280" height="300">
          <figcaption>{{ $t('tournamentsService') }}</figcaption>
        </figure>
      </a>
    </div>
    <router-link to="Carte">
      <div class="voircarte">
        {{ $t('viewMap') }}
      </div>
    </router-link>
    <h2 class="h2-down-container">{{ $t('providersTitle') }}</h2>
    <div class="down-container-down-part">
      <br><br><br><br><br><br><br><br><br><br><br><br><br><br>
      <form class="label-input-wrapper">
        <label for="prestataire">{{ $t('searchProvider') }}</label>
        <input id="prestataire" class="prestatairefiltreinput" type="text" :placeholder="$t('searchPlaceholder')">
      </form>
      <br>
      <div class="checkbox-container">
        <div class="checkbox-wrapper-2">
          <label for="restaurationCheckbox">{{ $t('restaurateur') }}</label>
          <input type="checkbox" name="restaurationCheckbox" class="sc-gJwTLC ikxBAC">
        </div>
        <div class="checkbox-wrapper-2">
          <label for="vendeurCheckbox">{{ $t('seller') }}</label>
          <input type="checkbox" name="vendeurCheckbox" class="sc-gJwTLC ikxBAC">
        </div>
        <div class="checkbox-wrapper-2">
          <label for="organisateurCheckbox">{{ $t('organizer') }}</label>
          <input type="checkbox" name="organisateurCheckbox" class="sc-gJwTLC ikxBAC">
        </div>
        <div class="checkbox-wrapper-2">
          <label for="createurCheckbox">{{ $t('creator') }}</label>
          <input type="checkbox" name="createurCheckbox" class="sc-gJwTLC ikxBAC">
        </div>
      </div>
    </div>
    <br><br><br><br><br><br><br><br><br>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-cta">
          <div class="cta-item">
            <i class="fas fa-map-marker-alt"></i>
            <div class="cta-text">
              <h4>{{ $t('findUs') }}</h4>
              <p>2 Rue de la Citadelle, 79200 Parthenay</p>
            </div>
          </div>
          <div class="cta-item">
            <i class="fas fa-phone"></i>
            <div class="cta-text">
              <h4>{{ $t('callUs') }}</h4>
              <p>01 02 03 04 05</p>
            </div>
          </div>
          <div class="cta-item">
            <i class="far fa-envelope-open"></i>
            <div class="cta-text">
              <h4>{{ $t('emailUs') }}</h4>
              <p>mail@info.com</p>
            </div>
          </div>
        </div>

        <div class="footer-content">
          <div class="footer-column">
            <div class="footer-logo">
              <a href="index.html">
                <img src="../assets/images/logov2.png" alt="Logo" class="logo">
              </a>
            </div>
            <p class="footer-description">
              {{ $t('footerDescription') }}
            </p>
            <div class="footer-social">
              <span>{{ $t('followUs') }}</span>
              <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-google-plus-g"></i></a>
            </div>
          </div>
          <div class="footer-column">
            <h3>{{ $t('usefulLinks') }}</h3>
            <ul class="footer-links">
              <li><a href="#">{{ $t('Accueil') }}</a></li>
              <li><a href="#">{{ $t('about') }}</a></li>
              <li><a href="#">{{ $t('Activités') }}</a></li>
              <li><a href="#">{{ $t('Produits') }}</a></li>
              <li><a href="#">{{ $t('contact') }}</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>{{ $t('Connexion') }}</h3>
            <p></p>
            <form action="#" class="subscribe-form">
              <input type="text" :placeholder="$t('username')" required>
              <input type="password" :placeholder="$t('password')" required>
              <button type="submit"><i class="fab fa-telegram-plane"></i>{{ $t('Connexion') }}</button>
            </form>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-bottom-left">
            <p>&copy; 2024, {{ $t('allRights') }} <a href="https://www.jeux-festival.com/">FLIP</a></p>
          </div>
          <div class="footer-bottom-right">
            <ul class="footer-bottom-links">
              <li><a href="#">{{ $t('Accueil') }}</a></li>
              <li><a href="#">{{ $t('terms') }}</a></li>
              <li><a href="#">{{ $t('privacy') }}</a></li>
              <li><a href="#">{{ $t('contact') }}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
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
          titleKey: "accueil.slide1.title",
          subtitleKey: "accueil.slide1.subtitle",
        },
        {
          titleKey: "accueil.slide2.title",
          subtitleKey: "accueil.slide2.subtitle",
        },
        {
          titleKey: "accueil.slide3.title",
          subtitleKey: "accueil.slide3.subtitle",
        },
        {
          titleKey: "accueil.slide4.title",
          subtitleKey: "accueil.slide4.subtitle",
        },
      ],
      carouselSlides: [
        {
          titleKey: "accueil.carousel1.title",
          subtitleKey: "accueil.carousel1.subtitle",
          descriptionKey: "accueil.carousel1.description",
          image: require("../assets/images/imagefestival_1.png"),
        },
        {
          titleKey: "accueil.carousel2.title",
          subtitleKey: "accueil.carousel2.subtitle",
          descriptionKey: "accueil.carousel2.description",
          image: require("../assets/images/imagefestival_2.png"),
        },
        {
          titleKey: "accueil.carousel3.title",
          subtitleKey: "accueil.carousel3.subtitle",
          descriptionKey: "accueil.carousel3.description",
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
    goToBoutique() {
      this.$router.push({ path: '/Produits', query: { tab: 'Boutique' } });
    },
    goToTournois() {
      this.$router.push({ path: '/Activites', query: { tab: 'Tournois' } });
    },
    startTextTransition() {
      setInterval(() => {
        this.fadeText = false;

        setTimeout(() => {
          this.currentIndex = (this.currentIndex + 1) % this.slides.length;
          this.fadeText = true;
        }, 1000);
      }, 6000);
    },
    startCarouselTransition() {
      setInterval(() => {
        this.fadeImage = false;

        setTimeout(() => {
          this.currentCarouselIndex = (this.currentCarouselIndex + 1) % this.carouselSlides.length;
          this.fadeImage = true;
        }, 1000);
      }, 6000);
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
  box-shadow: black 0px 0px 15px;
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
  background-color: #fbfbfb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.leftuptextcontainer {
  text-align: left;
  padding-left: 160px;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  color: black;
}

.leftuptextcontainer>h3 {
  color: #444444;
}

.leftuptextcontainer>h5 {
  color: gray;
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
  color: black;
  padding-top: 30px;
  padding-bottom: 10px;
}

.content-container {
  display: flex;
  justify-content: center;
  /* Centre les sections horizontalement */
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px;
}

.section-one,
.section-two,
.section-three {
  flex: 0 0 30%;
  margin: 0 60px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.section-one:hover,
.section-two:hover,
.section-three:hover {
  transform: translateY(-5px);
}

.section-title {
  margin-bottom: 15px;
  color: black;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 24px;
  display: inline-block;
}

.section-content {
  display: flex;
  align-items: center;
}

.section-image {
  width: 100%;
  margin: 20px 0;
  box-shadow: black 0px 0px 5px;
  height: 46%;
}

.section-text {
  flex: 1;
  line-height: 1.7;
  font-size: 18px;
}


.down-container-title {
  color: black;
  padding-top: 30px;
  padding-bottom: 10px;
}

.down-container-up-part {
  width: 100%;
  height: 275px;
  background-image: url("../assets/images/secondbackgroundimage.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
  box-shadow: black 0px 0px 15px;
}

.more-button {
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background: linear-gradient(90deg, #ff4500, #ffa500);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-transform: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
}

.more-button:hover {
  background: linear-gradient(90deg, #e63e00, #ff9c00);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.more-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.more-button:focus {
  outline: 2px solid #ff4500;
  outline-offset: 2px;
}


.down-container-mid-part {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 20px 0;
}



figure {
  display: grid;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
}

figure>* {
  grid-area: 1/1;
  transition: .4s;
}

figure figcaption {
  display: grid;
  align-items: center;
  font-family: sans-serif;
  font-size: 2.3rem;
  font-weight: bold;
  color: #0000;
  padding: .75rem;
  background: var(--c, rgba(255, 255, 255, 0.8));
  clip-path: inset(0 var(--_i, 100%) 0 0);
  -webkit-mask:
    linear-gradient(#000 0 0),
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  -webkit-mask-clip: text, padding-box;
  margin: -1px;
}

figure:hover figcaption {
  --_i: 0%;
}

figure:hover img {
  transform: scale(1.2);
}

@supports not (-webkit-mask-clip: text) {
  figure figcaption {
    -webkit-mask: none;
    color: #fff;
  }
}

.down-container-mid-part-title {
  text-align: center;
  margin-top: 100px;
  color: black;
}

.voircarte {
  background-color: #1A1A1A;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

.voircarte:before {
  content: "🗺️";
  font-size: 18px;
  margin-right: 8px;
  position: relative;
  top: 0px;
  transition: transform 0.3s ease;
}

.voircarte:hover {
  background-color: #333333;
  font-weight: bold;
  transform: scale(1.05);
}

.voircarte::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transform: skewX(-30deg);
  transition: left 0.6s ease;
}

.voircarte:hover::after {
  left: 100%;
}

.h2-down-container {
  color: black;
  padding-top: 30px;
  padding-bottom: 10px;
}

.label-input-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
}

.label-input-wrapper label {
  font-size: 16px;
  color: #555;
}

.prestatairefiltreinput {
  height: 30px;
  width: 300px;
  font-size: 14px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.prestatairefiltreinput:focus {
  border-color: #007bff;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
  outline: none;
}


.prestatairefiltre>label {
  padding: 20px;
}

.checkbox-wrapper-2 .ikxBAC {
  appearance: none;
  background-color: #dfe1e4;
  border-radius: 72px;
  border-style: none;
  flex-shrink: 0;
  height: 20px;
  margin: 0;
  position: relative;
  width: 30px;
  top: 3px;
  margin-left: 5px;
}

.checkbox-wrapper-2 .ikxBAC::before {
  bottom: -6px;
  content: "";
  left: -6px;
  position: absolute;
  right: -6px;
  top: -6px;
}

.checkbox-wrapper-2 .ikxBAC,
.checkbox-wrapper-2 .ikxBAC::after {
  transition: all 100ms ease-out;
}

.checkbox-wrapper-2 .ikxBAC::after {
  background-color: #fff;
  border-radius: 50%;
  content: "";
  height: 14px;
  left: 3px;
  position: absolute;
  top: 3px;
  width: 14px;
}

.checkbox-wrapper-2 input[type=checkbox] {
  cursor: default;
}

.checkbox-wrapper-2 .ikxBAC:hover {
  background-color: #c9cbcd;
  transition-duration: 0s;
}

.checkbox-wrapper-2 .ikxBAC:checked {
  background-color: #6e79d6;
}

.checkbox-wrapper-2 .ikxBAC:checked::after {
  background-color: #fff;
  left: 13px;
}

.checkbox-wrapper-2 :focus:not(.focus-visible) {
  outline: 0;
}

.checkbox-wrapper-2 .ikxBAC:checked:hover {
  background-color: #535db3;
}

.checkbox-container {
  display: flex;
  justify-content: center;
  gap: 25px;
}

.checkbox-wrapper-2 {
  margin: 15px;
}

.down-container-down-part {}

.staticlogo {
  position: absolute;
  margin-bottom: 430px;
  margin-left: 100px;
  z-index: 1;
}

.footer {
  width: 100%;
  background-color: black;
  color: #fff;
  padding: 80px 20px;
  font-size: 15px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.footer-cta {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
  padding-bottom: 30px;
  border-bottom: 2px solid #444;
}

.cta-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  flex: 1 1 200px;
}

.cta-item i {
  font-size: 32px;
  color: #ff6f00;
  transition: color 0.3s ease;
}

.cta-item i:hover {
  color: #ff9e00;
}

.cta-text {
  text-align: center;
}

.cta-text h4 {
  font-size: 18px;
  font-weight: bold;
  color: #ff6f00;
}

.cta-text p {
  font-size: 14px;
  color: #bbb;
  line-height: 1.6;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  gap: 50px;
  flex-wrap: wrap;
  padding-bottom: 30px;
}

.footer-column {
  flex: 1;
  min-width: 280px;
}

.footer-logo {
  margin-bottom: 20px;
}

.footer-logo img {
  max-width: 250px;
  height: auto;
  transition: transform 0.3s ease;
}

.footer-logo img:hover {
  transform: scale(1.05);
}

.footer-description {
  font-size: 14px;
  color: #bbb;
  line-height: 1.8;
  margin-bottom: 20px;
}

.footer-social {
  display: flex;
  gap: 20px;
}

.footer-social span {
  font-weight: bold;
  color: #ff6f00;
  transition: color 0.3s ease;
}

.footer-social span:hover {
  color: #ff9e00;
}

.social-icon {
  font-size: 22px;
  color: #bbb;
  transition: color 0.3s ease, transform 0.3s ease;
}

.social-icon:hover {
  color: #ff6f00;
  transform: translateY(-5px);
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin: 15px 0;
}

.footer-links li a {
  text-decoration: none;
  color: #bbb;
  font-size: 14px;
  transition: color 0.3s ease, letter-spacing 0.3s ease;
}

.footer-links li a:hover {
  color: #ff6f00;
  letter-spacing: 1px;
}

.subscribe-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.subscribe-form input {
  padding: 15px;
  font-size: 15px;
  border: 1px solid #555;
  border-radius: 5px;
  color: #333;
  background-color: #fff;
  transition: border-color 0.3s ease;
}

.subscribe-form input:focus {
  border-color: #ff6f00;
  outline: none;
}

.subscribe-form button {
  background-color: #ff6f00;
  color: #fff;
  padding: 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.subscribe-form button:hover {
  background-color: #e65100;
  transform: translateY(-3px);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 2px solid #444;
  padding-top: 20px;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-bottom-left {
  font-size: 14px;
  color: #bbb;
}

.footer-bottom-left a {
  color: #ff6f00;
  text-decoration: none;
  transition: color 0.3s ease, text-decoration 0.3s ease;
}

.footer-bottom-left a:hover {
  text-decoration: underline;
}

.footer-bottom-right {
  font-size: 14px;
  display: flex;
  gap: 30px;
}

.footer-bottom-links {
  display: flex;
  gap: 20px;
  list-style: none;
}

.footer-bottom-links li a {
  color: #bbb;
  text-decoration: none;
  transition: color 0.3s ease, transform 0.3s ease;
}

.footer-bottom-links li a:hover {
  color: #ff6f00;
  transform: translateY(-3px);
}

@media (max-width: 1024px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }

  .footer-column {
    text-align: center;
    margin-bottom: 40px;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-bottom-left {
    margin-bottom: 20px;
  }

  .footer-bottom-right {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .footer-cta {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .footer-content {
    flex-direction: column;
    align-items: center;
  }

  .footer-column {
    text-align: center;
    margin-bottom: 40px;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-bottom-left {
    margin-bottom: 20px;
  }

  .footer-bottom-right {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
}

@keyframes hover-effect {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-5px);
  }
}

.footer-logo img:hover {
  animation: hover-effect 0.3s ease forwards;
}

.social-icon:hover,
.footer-links li a:hover,
.footer-bottom-links li a:hover {
  animation: hover-effect 0.3s ease forwards;
}
</style>