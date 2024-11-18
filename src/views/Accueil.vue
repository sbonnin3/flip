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
        <a href="https://www.jeux-festival.com/"><button type="submit" class="more-button">En savoir plus</button></a>
      </div>
      <img class="festivalimages" :class="{ 'slide-in': fadeImage }" :src="currentCarouselSlide.image"
           alt="imagefestival">
    </div>

    <div class="carousel-indicators">
      <span v-for="(slide, index) in carouselSlides" :key="index" :class="{ active: currentCarouselIndex === index }"
            class="indicator"></span>
    </div>

    <h1 class="down-container-title">Interessé ? plus d'informations qui vous donneront encore plus envie !</h1>
    <div class="content-container">
      <div class="section-one">
        <h2 class="section-title">De multiples jeux et activités</h2>
        <div class="section-content">
          <p class="section-text">Jeu de <strong>société</strong>, jeu de <strong>cartes</strong>, jeux <strong>vidéos</strong> (zones dédiées aux <strong>nouvelles technologies</strong> de jeu), jeux <strong>traditionnels</strong>, jeux en <strong>bois</strong>, jeux de <strong>rôles</strong>...</p>
        </div>
        <img src="../assets/images/flipgamepicture.jpg" alt="Description de l'image" class="section-image">
      </div>
      <div class="section-two">
        <h2 class="section-title">Boutique et souvenirs</h2>
        <div class="section-content">
          <p class="section-text">Le FLIP propose souvent des souvenirs tels que des jeux <strong>exclusifs</strong>, des <strong>tee-shirts</strong>, des <strong>affiches</strong>, et des <strong>goodies</strong>. Des <strong>boutiques</strong> sont également disponibles</p>
        </div>
        <img src="../assets/images/flipshoppicture.jpg" alt="Description de l'image" class="section-image">
      </div>
      <div class="section-three">
        <h2 class="section-title">Engagement écologique</h2>
        <div class="section-content">
          <p class="section-text">L’événement met en place des actions pour <strong>réduire</strong> son <strong>impact environnemental</strong> (réduction des <strong>déchets</strong>, <strong>sensibilisation au tri</strong>, utilisation de <strong>matériaux recyclables</strong>)</p>
        </div>
        <img src="../assets/images/flipenvironnementpicture.jpg" alt="Description de l'image" class="section-image">
      </div>
    </div>
    <div class="down-container-up-part">
    </div>
    <h2 class="down-container-mid-part-title">Les services</h2>
    <div class="down-container-mid-part">
        <router-link to="/Produits">
        <figure>
          <img src="../assets/images/burger.jpg" alt="Restauration" width="280" height="300">
          <figcaption>Restauration</figcaption>
        </figure>
        </router-link>

      <a href @click="goToBoutique" class="figure-link">
        <figure>
          <img src="../assets/images/boutique.jpg" alt="Boutique" width="280" height="300">
          <figcaption>Boutique</figcaption>
        </figure>
      </a>

      <router-link to="/Activites">
        <figure style>
          <img src="../assets/images/flipgamepicture.jpg" alt="Jeu" width="280" height="300">
          <figcaption>Jeux</figcaption>
        </figure>
      </router-link>

      <a href @click="goToTournois" class="figure-link">
        <figure>
          <img src="../assets/images/tournois_basketball.png" alt="Tournoi" width="280" height="300">
          <figcaption>Tournois</figcaption>
        </figure>
      </a>
    </div>
    <router-link to="Carte">
    <div class="voircarte">
      Voir la carte
    </div>
    </router-link>
      <h2 class="h2-down-container">Nos prestataires</h2>
    <div class="down-container-down-part">
<!-- liste prestataires qd y'aura json -->
<br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    <form class="label-input-wrapper">
      <label for="prestataire">Rechercher un prestataire</label>
      <input id="prestataire" class="prestatairefiltreinput" type="text" placeholder="Rechercher... (nom)">
    </form>
    <br>
    <div class="checkbox-container">
    <div class="checkbox-wrapper-2">
      <label for="restaurationCheckbox">Restaurateur</label>
      <input type="checkbox" name="restaurationCheckbox" class="sc-gJwTLC ikxBAC">
    </div>
    <div class="checkbox-wrapper-2">
      <label for="vendeurCheckbox">Vendeur</label>
      <input type="checkbox" name="vendeurCheckbox" class="sc-gJwTLC ikxBAC">
    </div>
    <div class="checkbox-wrapper-2">
      <label for="organisateurCheckbox">Organisateur</label>
      <input type="checkbox" name="organisateurCheckbox" class="sc-gJwTLC ikxBAC">
    </div>
    <div class="checkbox-wrapper-2">
      <label for="createurCheckbox">Créateur</label>
      <input type="checkbox" name="createurCheckbox" class="sc-gJwTLC ikxBAC">
    </div>
    </div>
      </div>
    <br><br><br>
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

.leftuptextcontainer > h3 {
  color: #444444;
}

.leftuptextcontainer > h5 {
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
  border-bottom: red solid 4px;
  color: black;
  padding-top: 30px;
  padding-bottom: 10px;
}

.content-container {
  display: flex;
  justify-content: center; /* Centre les sections horizontalement */
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px;
}

.section-one, .section-two, .section-three { /* Ajoute la section trois ici */
  flex: 0 0 30%; /* Ajustement pour trois sections */
  margin: 0 60px; /* Espace entre les sections */
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.section-one:hover, .section-two:hover, .section-three:hover { /* Ajout du hover pour la section 3 */
  transform: translateY(-5px); /* Effet de levée au survol */
}

.section-title {
  margin-bottom: 15px;
  color: black;
  border-bottom: 4px solid black;
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
  border-bottom: red solid 4px;
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
  outline: 2px solid #ff4500; /* Contour rouge vif au focus */
  outline-offset: 2px;
}


.down-container-mid-part {
  display: flex;
  gap: 20px; /* Espacement horizontal entre les figures */
  justify-content: center; /* Centre les figures dans le conteneur */
  padding: 20px 0; /* Optionnel : padding vertical autour des figures */
}



figure {
  display: grid;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
}
figure > * {
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
  clip-path: inset(0 var(--_i,100%) 0 0);
  -webkit-mask:
      linear-gradient(#000 0 0),
      linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  -webkit-mask-clip: text, padding-box;
  margin: -1px;
}
figure:hover figcaption{
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
  border-bottom: red solid 4px;
  margin-top: 35px;
  color: black;
}

.voircarte {
  background-color: #1A1A1A; /* Noir élégant */
  color: #ffffff; /* Bleu lumineux pour le texte */
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
  content: "🗺️"; /* Icône de localisation */
  font-size: 18px;
  margin-right: 8px;
  position: relative;
  top: 0px;
  transition: transform 0.3s ease;
}

/* Animation de lumière au survol */
.voircarte:hover {
  background-color: #333333; /* Changement du fond en bleu */
  font-weight: bold;
  transform: scale(1.05);
}

/* Ligne de lumière glissante */
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
  border-bottom: red solid 4px;
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


.prestatairefiltre > label {
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

.down-container-down-part {
}


</style>