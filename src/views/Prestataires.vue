<template>
  <div class="prestataire-container">
    <h1 class="page-title">Page prestataires</h1>

    <div class="tab-container">
      <button @click="selectTab('Restauration')"
              :class="{ active: selectedTab === 'Restauration' }">Restauration</button>
      <button @click="selectTab('Boutique')" :class="{ active: selectedTab === 'Boutique' }">Boutique</button>
      <button @click="selectTab('Créateurs de jeux')" :class="{ active: selectedTab === 'Créateur de jeux' }">Créateur
        de jeux</button>
      <button @click="selectTab('Organisateurs')"
              :class="{ active: selectedTab === 'Organisateurs' }">Organisateurs</button>
    </div>

    <div v-if="selectedTab === 'Restauration'">
      <div class="cards-container" v-if="restaurants.length">
        <div v-for="restaurant in restaurants" :key="restaurant._id" class="card" @click="openModalRestau(restaurant)">
          <img :src="restaurant.image" alt="Image du restaurant" class="card-image" />
          <div class="card-content">
            <h2 class="card-title">{{ restaurant.nom }}</h2>
          </div>
        </div>
      </div>
      <p v-else>Aucun restaurants disponible.</p>
    </div>

    <div v-if="selectedModalRestau" class="modal" style="padding-top: 50px">
      <div class="modal-content">
        <span class="close-button" @click="closeModalRestau">&times;</span>
        <h2>{{ selectedModalRestau.name }}</h2>
        <img :src="selectedModalRestau.image" alt="Image du restaurant" class="modal-image"
             style=" width: 50%; height: 50%"/>
        <div v-for="stand in stands.filter(stand => stand.idRestau === selectedModalRestau._id)" :key="stand.id">
          <p><strong>Nourritures :</strong></p>
          <div class="buttons-container" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <div v-for="nourriture in stand.nourritures" :key="nourriture.nom" class="article-button">
              <button @click="addToCart(nourriture)" class="article-button-content">
                <img :src="nourriture.image" alt="Image de l'article" class="article-image" />
                {{ nourriture.nom }} - {{ nourriture.prix }}€
              </button>
            </div>
          </div>
          <p><strong>Boissons :</strong></p>
          <div class="buttons-container" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <div v-for="boisson in stand.boissons" :key="boisson.nom" class="article-button">
              <button @click="addToCart(boisson)" class="article-button-content">
                <img :src="boisson.image" alt="Image de l'article" class="article-image">
                {{ boisson.nom }} - {{ boisson.prix }}€
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedTab === 'Boutique'">
      <h2 class="page-other_title">JEUX</h2>
      <div class="cards-container" v-if="jeux.length">
        <div v-for="jeu in jeux" :key="jeu._id" class="card" @click="openModalJeu(jeu)">
          <img :src="jeu.image" alt="Image du jeu" class="card-image" />
          <div class="card-content">
            <h2 class="card-title">{{ jeu.name }}</h2>
            <p class="card-price"><strong>Prix :</strong> {{ jeu.prix }}€</p>
          </div>
        </div>
      </div>

      <p v-else>Aucun jeux disponible.</p>

      <h2 class="page-other_title">SOUVENIRS</h2>
      <div class="cards-container" v-if="souvenirs.length">
        <div v-for="souvenir in souvenirs" :key="souvenir._id" class="card">
          <img :src="souvenir.image" alt="Image du souvenir" class="card-image" />
          <div class="card-content">
            <h2 class="card-title">{{ souvenir.nom }}</h2>
            <p class="card-price"><strong>Prix : </strong> {{ souvenir.prix }}€</p>
          </div>
        </div>
      </div>
      <p v-else>Aucun souvenirs disponible.</p>
    </div>

    <div v-if="selectedModalJeu" class="modal">
      <div class="modal-content">
        <span class="close-button" @click="closeModalJeu">&times;</span>
        <h2>{{ selectedModalJeu.name }}</h2>
        <img :src="selectedModalJeu.image" alt="Image du jeu" class="modal-image" />
        <p><strong>Type :</strong> {{ selectedModalJeu.type }}</p>
        <p><strong>Joueurs :</strong> {{ selectedModalJeu.nombre_de_joueurs }}</p>
        <p><strong>Âge minimum : </strong> À partir de {{ selectedModalJeu.age_minimum }} ans</p>
        <p><strong>Durée : </strong> {{ selectedModalJeu.duree }} min</p>
        <p><strong>Éditeur :</strong> {{ selectedModalJeu.editeur }}</p>
      </div>
    </div>

    <div v-if="selectedTab === 'Créateurs de jeux'">
    </div>

    <div v-if="selectedTab === 'Organisateurs'">
    </div>
  </div>
</template>

<script>

import { jeux, restaurants, souvenirs, stands } from '@/datasource/data';

export default {
  name: "PagePrestataires",
  data() {
    return {
      selectedTab: null,
      selectedModalJeu: null,
      selectedModalRestau: null,
      jeux,
      souvenirs,
      restaurants,
      stands
    };
  },
  methods: {
    selectTab(tab) {
      this.selectedTab = tab;
    },
    openModalJeu(jeu) {
      this.selectedModalJeu = jeu;
    },
    closeModalJeu() {
      this.selectedModalJeu = null;
    },
    openModalRestau(restaurant) {
      this.selectedModalRestau = restaurant;
    },
    closeModalRestau() {
      this.selectedModalRestau = null;
    },
    addToCart(article) {
      console.log('Ajouté au panier :', article);
      // Plus tard, tu pourras ajouter la logique d'ajout au panier ici.
    },
  },
};
</script>

<style scoped>
.modal,
.reservation-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: left;
  position: relative;
}

.modal-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin-bottom: 20px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
}

.reserve-button {
  background-color: #f04e23;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reserve-button:hover {
  background-color: #d83d1a;
}

.tab-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-container button {
  padding: 10px 20px;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  background: none;
  font-size: 1em;
  margin: 0 10px;
  transition: color 0.3s ease, border-bottom-color 0.3s ease;
}

.tab-container button:hover,
.tab-container button.active {
  color: #d22328;
  border-bottom-color: #d22328;
}

.modal,
.reservation-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: left;
  position: relative;
}

.modal-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin-bottom: 20px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
}

.reserve-button {
  background-color: #f04e23;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reserve-button:hover {
  background-color: #d83d1a;
}

.article-button-content {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 10px;
  margin: 5px 0;
  width: 180px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
}

.article-button-content:hover {
  background-color: #45a049;
}

.article-image {
  width: 40px; /* taille de l'image */
  height: 40px;
  margin-right: 10px; /* espacement entre l'image et le texte */
  border-radius: 5px;
}

form {
  display: flex;
  flex-direction: column;
}

form label {
  margin: 10px 0 5px;
}

form input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

form button {
  align-self: flex-start;
}

.tab-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-container button {
  padding: 10px 20px;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  background: none;
  font-size: 1em;
  margin: 0 10px;
  transition: color 0.3s ease, border-bottom-color 0.3s ease;
}

.tab-container button:hover,
.tab-container button.active {
  color: #d22328;
  border-bottom-color: #d22328;
}

.prestataire-container {
  padding-top: 100px;
  text-align: center;
}

.page-title {
  font-size: 2em;
  margin-bottom: 20px;
}

.page-other_title {
  font-size: 1.5em;
  margin-bottom: 30px;
  margin-top: 30px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.05);
  background-color: #fce012;
}

.card-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.card-content {
  padding: 15px;
}

.card-title {
  font-size: 1.5em;
  margin: 10px 0;
}

.card-type,
.card-price,
.card-player {
  font-size: 1em;
  color: #555;
  margin: 5px 0;
}

.modal,
.reservation-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: left;
  position: relative;
}

.modal-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin-bottom: 20px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
}

.reserve-button {
  background-color: #f04e23;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reserve-button:hover {
  background-color: #d83d1a;
}

form {
  display: flex;
  flex-direction: column;
}

form label {
  margin: 10px 0 5px;
}

form input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

form button {
  align-self: flex-start;
}
</style>