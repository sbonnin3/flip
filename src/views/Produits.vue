<template>
  <div class="prestataire-container">
    <h1 class="page-title">Produits</h1>

    <div class="tab-container">
      <button :class="{ active: selectedTab === 'Restauration' }"
              @click="selectTab('Restauration')">Restauration</button>
      <button :class="{ active: selectedTab === 'Boutique' }" @click="selectTab('Boutique')">Boutique</button>
    </div>

    <div v-show="selectedTab === 'Restauration'">
      <div v-if="stands.length" class="cards-container">
        <div v-for="restaurant in stands.filter(stand => stand.type === 'restaurants')" :key="restaurant.idRestau" class="card" @click="openModalRestau(restaurant)">
          <img :src="restaurant.image" alt="Image du restaurant" class="card-image" />
          <div class="card-content">
            <h2 class="card-title">{{ restaurant.nom }}</h2>
          </div>
        </div>
      </div>
      <p v-else>Aucun restaurants disponible.</p>


      <div class="cart_section">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-10 offset-lg-1">
              <div class="cart_container">
                <h1 class="cart_title">Panier</h1>
                <div class="cart_items">
                  <ul class="cart_list">
                    <li v-for="item in cart" :key="item.nom" class="cart_item">
                      <div class="cart_item_image">
                        <img :src="item.image" alt="Image du produit" />
                      </div>
                      <div class="cart_item_info">
                        <div class="cart_item_title">Nom</div>
                        <div class="cart_item_text">{{ item.nom }}</div>
                      </div>
                      <div class="cart_item_quantity">
                        <div class="cart_item_title">Quantité</div>
                        <div class="cart_item_text">{{ item.quantite }}</div>
                      </div>
                      <div class="cart_item_price">
                        <div class="cart_item_title">Prix</div>
                        <div class="cart_item_text">{{ item.prix }}€</div>
                      </div>
                      <div class="cart_button_clear_logo" @click="deleteArticle(item)">
                        <img src="../assets/icons/bin.png" alt="logo poubelle" width="35px" height="35px" />
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="order_total">
                  <div class="order_total_content text-md-right">
                    <div class="order_total_title">Prix total: {{ cart.reduce((total, item) => total + item.prix * item.quantite, 0) }}€ </div>
                    <!-- div class="order_total_amount"></div-->
                  </div>
                </div>
                <div class="cart_buttons">
                  <button class="button cart_button_clear" @click="deleteCommand">Supprimer</button>
                  <button class="button cart_button_checkout" @click="openCommandConfirmation">Commander</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--      <div class="cart">
              <h3>Panier</h3>
              <div v-for="item in cart" :key="item.nom" class="cart-item">
                <p>{{ item.nom }} - {{ item.prix }}€ x {{ item.quantite }}</p>
              </div>
              <p>Total : {{ cart.reduce((total, item) => total + item.prix * item.quantite, 0) }}€</p>
              <button class="reserve-button" @click="openCommandConfirmation">Commander</button>
              <button class="reserve-button" @click="deleteCommand" style="margin-left: 10px">Effacer</button>
            </div>
          </div>-->

    <div v-if="showConfirmation" class="confirmation-modal">
      <div class="modal-content">
        <span class="close-button" @click="closeConfirmation">&times;</span>
        <h2>Confirmer la commande</h2>
        <p>Voulez-vous vraiment confirmer la commande du panier ?</p>
        <button class="confirm-button" @click="confirmReservation">Confirmer</button>
        <button class="cancel-button" @click="closeConfirmation">Annuler</button>
      </div>
    </div>

    <div v-if="commandMessage" class="reservation-message">
      <div class="modal-content">
        <p>{{ commandMessage }}</p>
        <button @click="closeCommandMessage">OK</button>
      </div>
    </div>

      <!-- Modale de connexion -->
      <ConnexionModal
          v-if="showLoginModal"
          :visible="showLoginModal"
          @close="closeLoginModal"
          @login-success="handleLoginSuccess"
      />

    <div v-if="selectedModalRestau" class="modal" style="padding-top: 50px">
      <div class="modal-content">
        <span class="close-button" @click="closeModalRestau">&times;</span>
        <h2>{{ selectedModalRestau.nom }}</h2>
        <img :src="selectedModalRestau.image" alt="Image du restaurant" class="modal-image"
             style=" width: 50%; height: 50%"/>
        <div v-for="stand in stands.filter(stand => stand.idRestau === selectedModalRestau.idRestau)" :key="stand.id">
          <p><strong>Nourritures :</strong></p>
          <div class="buttons-container" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <div v-for="nourriture in stand.nourritures" :key="nourriture.nom" class="article-button">
              <button class="article-button-content" @click="addToCart(nourriture)">
                <img :src="nourriture.image" alt="Image de l'article" class="article-image" />
                {{ nourriture.nom }} - {{ nourriture.prix }}€
              </button>
            </div>
          </div>
          <p><strong>Boissons :</strong></p>
          <div class="buttons-container" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <div v-for="boisson in stand.boissons" :key="boisson.nom" class="article-button">
              <button class="article-button-content" @click="addToCart(boisson)">
                <img :src="boisson.image" alt="Image de l'article" class="article-image">
                {{ boisson.nom }} - {{ boisson.prix }}€
              </button>
            </div>
          </div>
        </div>
        <div v-if="cardCommandMessage" class="reservation-message">
          <div class="modal-content">
            <p>{{ cardCommandMessage }}</p>
            <button @click="closeCardCommandMessage">OK</button>
          </div>
        </div>
      </div>
    </div>
    </div>

    <div v-if="selectedTab === 'Boutique'">
      <h2 class="page-other_title">JEUX</h2>
      <div v-if="jeux.length" class="cards-container">
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
      <div v-if="souvenirs.length" class="cards-container">
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

import { jeux, souvenirs, stands } from '@/datasource/data';
import { mapActions } from 'vuex';
import ConnexionModal from "@/components/Connexion.vue";

export default {
  name: "PagePrestataires",
  components: {ConnexionModal},
  data() {
    return {
      selectedTab: "Restauration",
      selectedModalJeu: null,
      selectedModalRestau: null,
      cart: [],
      orders: [],
      showConfirmation: false,
      showLoginModal: false,
      commandMessage: '',
      cardCommandMessage: '',
      jeux,
      souvenirs,
      stands
    };
  },
  mounted() {
    // Vérifie si un paramètre `tab` est présent dans l'URL au moment du chargement de la page
    const selectedTab = this.$route.query.tab;
    if (selectedTab) {
      this.selectTab(selectedTab);
    }
  },
  watch: {
    // Surveille les changements de l'URL pour mettre à jour l'onglet si nécessaire
    '$route.query.tab'(newTab) {
      if (newTab) {
        this.selectTab(newTab);
      }
    }
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
      const currentUser = this.$store.state.userSession;

      if (!currentUser) {
        // Si aucun utilisateur n'est connecté, afficher la modale de connexion
        this.showLoginModal = true;
        return;
      }

      if (this.cart.length > 0) {
        // Grouper les articles par restaurant
        const ordersByRestaurant = this.cart.reduce((acc, article) => {
          const restaurantName = article.restaurant;

          if (!acc[restaurantName]) {
            acc[restaurantName] = { restaurantNom: restaurantName, articles: [] };
          }
          acc[restaurantName].articles.push(article);
          return acc;
        }, {});

        // Ajouter les commandes
        Object.values(ordersByRestaurant).forEach((restaurantOrder) => {
          this.addArticleOrder({
            ...restaurantOrder,
            status: "Confirmée",
          });
        });

        // Vider le panier et masquer la confirmation
        this.cart = [];
        this.showConfirmation = false;
        this.commandMessage = "Votre commande a été confirmée !";
      } else {
        this.showConfirmation = false;
        this.commandMessage = "Erreur : panier vide.";
      }
    },
    closeLoginModal() {
      this.showLoginModal = false;
    },
    handleLoginSuccess() {
      this.commandMessage = "Connexion réussie !";
    },
    deleteCommand(){
      this.cart = [];
      this.commandMessage = 'Votre commande a été effacée !'
      console.log('Panier actuel :', this.cart);
    },
    closeCommandMessage() {
      this.commandMessage = '';
    },
    closeCardCommandMessage() {
      this.cardCommandMessage = '';
    },
    addToCart(article) {
      // Vérifier si l'article est déjà dans le panier
      const itemInCart = this.cart.find(item => item.nom === article.nom);

      if (itemInCart) {
        // Si l'article existe déjà, on augmente la quantité
        itemInCart.quantite += 1;
        this.cardCommandMessage = "Article ajouté dans le panier !"
      } else {
        // Sinon, on ajoute un nouvel article avec une quantité initiale de 1
        this.cart.push({ ...article, quantite: 1, restaurant: this.selectedModalRestau.nom});
        this.cardCommandMessage = "Article ajouté dans le panier !"
      }

      console.log('Ajouté au panier :', article);
      console.log('Panier actuel :', this.cart);
    },

    deleteArticle(article) {
      const itemInCartToDelete = this.cart.find(item => item.nom === article.nom);

      if (itemInCartToDelete) {
        itemInCartToDelete.quantite -= 1;

        if (itemInCartToDelete.quantite <= 0) {
          // Supprimer l'article du panier si la quantité atteint 0
          this.cart = this.cart.filter(item => item.nom !== article.nom);
          this.commandMessage = 'Article retiré du panier.'
        }
      }
    }
  },
};
</script>

<style scoped>

.confirmation-modal,
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.confirm-button {
  background: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}

.cancel-button {
  background: #f44336;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}

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

/*.cart {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  margin: 20px auto;
  box-shadow: 0 4px 8px 4px rgba(0, 0, 0, 0.1);
}

.cart h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  text-align: center;
  color: #333;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.cart-item p {
  margin: 0;
  font-size: 1rem;
  color: #555;
}

.cart p:last-of-type {
  font-weight: bold;
  font-size: 1.2rem;
  text-align: right;
  color: #333;
}

.reserve-button {
  background-color: #4CAF50;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1rem;
}

.reserve-button:hover {
  background-color: #45a049;
}

.reserve-button:active {
  background-color: #45a049;
}

.reserve-button + .reserve-button {
  margin-left: 10px;
}

.reserve-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .cart {
    padding: 15px;
  }

  .cart h3 {
    font-size: 1.3rem;
  }

  .reserve-button {
    width: 100%;
    margin: 10px 0;
  }
}*/

.cart_list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.cart_item {
  display: grid;
  grid-template-columns: 35em 13em 13em 13em 30em; /* Réduit les largeurs des colonnes */
  gap: 5px; /* Réduit davantage l'espacement entre les colonnes */
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  padding: 8px 0; /* Réduit l'espace vertical */
}

.cart_item_image img {
  width: 70px; /* Réduit la taille de l'image pour gagner de l'espace */
  height: auto;
  border-radius: 5px;
}

.cart_item_info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px; /* Réduit l'espacement entre les lignes d'informations */
}

.cart_item_title {
  font-size: 18px; /* Taille réduite pour compacter */
  color: #888;
}

.cart_item_text {
  font-size: 20px; /* Taille ajustée pour plus de compacité */
  color: #333;
  white-space: nowrap; /* Empêche les débordements */
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart_item_quantity,
.cart_item_price {
  text-align: center;
  font-size: 14px; /* Taille légèrement réduite */
  padding: 0; /* Supprime tout espace interne */
  margin: 0; /* Supprime tout espace externe */
}



.order_total {
  margin-top: 20px;
  padding: 10px 15px;
  background: #f1f1f1;
  border-radius: 5px;
  display: flex; /* Aligne les éléments sur une ligne */
  justify-content: center; /* Centre les éléments horizontalement */
  align-items: center; /* Centre verticalement */
  gap: 10px; /* Espacement entre les éléments */
}

.order_total_title,
.order_total_amount {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.cart_buttons {
  margin-top: 20px;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  gap: 15px; /* Espacement entre les boutons */
  padding: 15px; /* Ajoute un espace autour des boutons */
}

.cart_button_clear_logo {
  cursor: pointer;
  transition: all 0.3s ease;
}

.cart_button_clear,
.cart_button_checkout {
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cart_button_clear {
  background-color: #f64242;
  color: #ffffff;
}

.cart_button_clear:hover {
  background-color: #fa0000;
  color: white;
}

.cart_button_checkout {
  background-color: #4CAF50;
  color: #fff;
}

.cart_button_checkout:hover {
  background-color: #45a049;
}



</style>