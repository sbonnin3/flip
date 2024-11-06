<template>
  <div class="prestataire-container">
    <h1 class="page-title">Produits</h1>

    <div class="tab-container">
      <button @click="selectTab('Restauration')"
              :class="{ active: selectedTab === 'Restauration' }">Restauration</button>
      <button @click="selectTab('Boutique')" :class="{ active: selectedTab === 'Boutique' }">Boutique</button>
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

      <div class="cart">
        <h3>Panier</h3>
        <div v-for="item in cart" :key="item.nom" class="cart-item">
          <p>{{ item.nom }} - {{ item.prix }}€ x {{ item.quantite }}</p>
        </div>
        <p>Total : {{ cart.reduce((total, item) => total + item.prix * item.quantite, 0) }}€</p>
        <button class="reserve-button" @click="openCommandConfirmation">Commander</button>
      </div>
    </div>

    <div v-if="showConfirmation" class="confirmation-modal">
      <div class="modal-content">
        <span class="close-button" @click="closeConfirmation">&times;</span>
        <h2>Confirmer la commande</h2>
        <p>Voulez-vous vraiment confirmer la commande du panier ?</p>
        <button @click="confirmReservation" class="confirm-button">Confirmer</button>
        <button @click="closeConfirmation" class="cancel-button">Annuler</button>
      </div>
    </div>

    <div v-if="commandMessage" class="reservation-message">
      <div class="modal-content">
        <p>{{ commandMessage }}</p>
        <button @click="closeCommandMessage">OK</button>
      </div>
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
  </div>
</template>

<script>

import { jeux, restaurants, souvenirs, stands } from '@/datasource/data';
import { mapActions } from 'vuex';

export default {
  name: "PagePrestataires",
  data() {
    return {
      selectedTab: null,
      selectedModalJeu: null,
      selectedModalRestau: null,
      cart: [],
      orders: [],
      showConfirmation: false,
      commandMessage: '',
      jeux,
      souvenirs,
      restaurants,
      stands
    };
  },
  methods: {
    ...mapActions(['addArticleOrder']),


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
    openCommandConfirmation() {
      this.showConfirmation = true;
    },
    closeConfirmation() {
      this.showConfirmation = false;
    },
    confirmReservation() {
      this.showConfirmation = false;

      const currentUser = this.$store.state.userSession;
      if (this.cart.length > 0 && currentUser) {
        // Appelle `addArticleOrder` pour stocker la commande dans le store
        this.addArticleOrder({
          articles: [...this.cart],
          status: 'Confirmée',
        });

        // Réinitialise le panier et affiche un message de confirmation
        this.cart = [];
        this.commandMessage = 'Votre commande a été confirmée !';
      } else {
        this.commandMessage = "Erreur : aucun utilisateur connecté.";
      }
    },
    closeCommandMessage() {
      this.commandMessage = '';
    },
    addToCart(article) {
      // Vérifier si l'article est déjà dans le panier
      const itemInCart = this.cart.find(item => item.nom === article.nom);

      if (itemInCart) {
        // Si l'article existe déjà, on augmente la quantité
        itemInCart.quantite += 1;
      } else {
        // Sinon, on ajoute un nouvel article avec une quantité initiale de 1
        this.cart.push({ ...article, quantite: 1 });
      }

      console.log('Ajouté au panier :', article);
      console.log('Panier actuel :', this.cart);
    },
  },
};
</script>

<style scoped>

.reservation-message {
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

.reservation-message .modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.reservation-message button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  margin-top: 10px;
}

.reservation-message button:hover {
  background-color: #45a049;
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

.confirmation-modal {
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

.confirmation-modal .modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
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
  background-color: #4CAF50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reserve-button:hover {
  background-color: #45a049;
}

.confirm-button,
.cancel-button {
  background-color: #4CAF50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.confirm-button:hover {
  background-color: #45a049;
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