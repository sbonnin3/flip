<template>
  <div class="prestataire-container">
    <div v-if="showAddModal" class="confirmation-modal">
      <div class="modal-content">
        <p>{{ addMessage }}</p>
        <button class="confirm-button" @click="showAddModal = false">OK</button>
      </div>
    </div>
    <h1 class="page-title">Produits</h1>
    <div class="tab-container">
      <button :class="{ active: selectedTab === 'Restauration' }"
        @click="selectTab('Restauration')">Restauration</button>
      <button :class="{ active: selectedTab === 'Boutique' }" @click="selectTab('Boutique')">Boutique</button>
    </div>
    <div v-show="selectedTab === 'Restauration'">
      <div v-if="stands.length" class="cards-container">
        <div v-for="restaurant in stands.filter(stand => stand.type === 'restaurants')" :key="restaurant.idRestau"
          class="card" @click="openModalRestau(restaurant)">
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
                    <div class="order_total_title">Prix total: {{cart.reduce((total, item) => total + item.prix *
                      item.quantite, 0)}}€ </div>
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
      <ConnexionModal v-if="showLoginModal" :visible="showLoginModal" @close="closeLoginModal"
        @login-success="handleLoginSuccess" />
      <PaymentModal ref="paymentForm" v-if="showPaymentModal" :visible="showPaymentModal" @close="closePaymentModal"
        @payment-success="handlePaymentSuccess" />

      <div v-if="selectedModalRestau" class="modal">
        <div class="modal-content">
          <span class="close-button" @click="closeModalRestau">&times;</span>
          <h2>{{ selectedModalRestau.nom }}</h2>
          <img :src="selectedModalRestau.image" alt="Image du restaurant" class="modal-image" />

          <p><strong>Nourritures :</strong></p>
          <div v-if="selectedModalRestau.nourritures && selectedModalRestau.nourritures.length" class="items-container">
            <div v-for="nourriture in selectedModalRestau.nourritures" :key="nourriture.nom" class="item-card">
              <button class="item-button-content" @click="addToCart(nourriture)">
                <img :src="nourriture.image" alt="Image de l'article" class="item-image" />
                <p>{{ nourriture.nom }} - {{ nourriture.prix }}€</p>
              </button>
            </div>
          </div>
          <p v-else>Aucune nourriture disponible.</p>

          <p><strong>Boissons :</strong></p>
          <div v-if="selectedModalRestau.boissons && selectedModalRestau.boissons.length" class="items-container">
            <div v-for="boisson in selectedModalRestau.boissons" :key="boisson.nom" class="item-card">
              <button class="item-button-content" @click="addToCart(boisson)">
                <img :src="boisson.image" alt="Image de l'article" class="item-image" />
                <p>{{ boisson.nom }} - {{ boisson.prix }}€</p>
              </button>
            </div>
          </div>
          <p v-else>Aucune boisson disponible.</p>

          <p><strong>Note</strong></p>
          <Note :averageRating="selectedModalRestau.notes" />

          <p><strong>Commentaires :</strong></p>
          <div v-if="selectedModalRestau.commentaires && selectedModalRestau.commentaires.length">
            <div v-for="comment in selectedModalRestau.commentaires" :key="comment.id">
              <p>{{ getUserName(comment.userId) }}</p>
              <div class="comments">{{ comment.texte }}</div>
            </div>
          </div>
          <p v-else>Aucun commentaire pour le moment.</p>

          <h3>Laisser un avis</h3>
          <form @submit.prevent="submitComment">
            <textarea v-model="newComment" placeholder="Votre commentaire"></textarea>
            <button type="submit">Envoyer</button>
          </form>
          <form @submit.prevent="submitRating">
            <label for="rating">Note (0-5):</label>
            <input type="number" id="rating" v-model="newRating" min="0" max="5" />
            <button type="submit">Envoyer</button>
          </form>
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
        <button class="button cart_button_checkout" @click="openCommandConfirmationBoutique">Commander</button>
      </div>
    </div>
    <div v-if="showConfirmationBoutique" class="confirmation-modal">
      <div class="modal-content">
        <span class="close-button" @click="closeConfirmationBoutique">&times;</span>
        <h2>Confirmer la commande</h2>
        <p>Voulez-vous vraiment confirmer la commande du jeu ?</p>
        <button class="confirm-button" @click="confirmReservationBoutique">Confirmer</button>
        <button class="cancel-button" @click="closeConfirmationBoutique">Annuler</button>
      </div>
    </div>
    <div v-if="commandMessage" class="reservation-message">
      <div class="modal-content">
        <p>{{ commandMessage }}</p>
        <button @click="closeCommandMessage">OK</button>
      </div>
    </div>
    <ConnexionModal v-if="showLoginModal" :visible="showLoginModal" @close="closeLoginModal"
      @login-success="handleLoginSuccess" />
    <PaymentModal v-if="showPaymentModalBoutique" :visible="showPaymentModalBoutique" :showPickupTime="false"
      @close="closePaymentModalBoutique" @payment-success="handlePaymentSuccessJeu" />
  </div>
</template>
<script>
import { jeux, souvenirs, reservationsJeux, commandes } from '@/datasource/data';
import { mapActions, mapGetters } from 'vuex';
import ConnexionModal from "@/components/Connexion.vue";
import PaymentModal from "@/components/PaymentForm.vue";
import Note from "@/components/StarRating.vue";
export default {
  name: "PagePrestataires",
  components: { PaymentModal, ConnexionModal, Note },
  data() {
    return {
      selectedTab: "Restauration",
      alertMessage: null,
      alertTimeout: null,
      showAddModal: false,
      addMessage: '',
      selectedModalJeu: null,
      selectedModalRestau: null,
      cart: [],
      orders: [],
      showConfirmation: false,
      showConfirmationBoutique: false,
      showLoginModal: false,
      showPaymentModal: false,
      showPaymentModalBoutique: false,
      commandMessage: '',
      cardCommandMessage: '',
      newComment: '',
      editingComment: null,
      editingRating: null,
      newRating: 0,
      jeux,
      souvenirs,
      reservationsJeux,
      commandes,
    };
  },
  mounted() {
  this.$store.dispatch("restaurants/initializeRestaurants").then(() => {
    this.$forceUpdate();  // Force le composant à se mettre à jour
  });
},
  watch: {
    restaurants: {
      handler(newRestaurants) {
        this.stands = newRestaurants;
      },
      immediate: true
    },
    '$route.query.tab'(newTab) {
      if (newTab) {
        this.selectTab(newTab);
      }
    }
  },
  computed: {
    ...mapGetters('restaurants', ['restaurants']),
    ...mapGetters('commandes', ['userOrders']),
  },
    stands() {
      // Toujours retourner les restaurants du store
      return this.restaurants || [];
    },
  hasPurchased() {
    return (productId) => {
      return this.userOrders.some(order => order.articles.some(article => article.id === productId));
    };
  },
  getUserName() {
    return (userId) => {
      const user = this.comptes.find(user => user.id === userId);
      console.log(user);
      return user ? user.identifiant : 'Unknown';
    };
  },
  methods: {
    ...mapActions('commandes', ['addArticleOrder', 'setCurrentOrder']),
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
    openCommandConfirmationBoutique() {
      this.showConfirmationBoutique = true;
    },
    closeConfirmationBoutique() {
      this.showConfirmationBoutique = false;
    },
    confirmReservation() {
      const currentUser = this.$store.state.user.userSession;
      if (!currentUser) {
        this.showLoginModal = true;
        return;
      }
      if (this.cart.length === 0) {
        this.closeConfirmation();
        this.commandMessage = "Erreur : panier vide.";
      } else {
        this.openPaymentModal();
        this.closeConfirmation();
      }
    },
    confirmReservationBoutique() {
      const currentUser = this.$store.state.user.userSession;
      if (!currentUser) {
        this.showLoginModal = true;
      } else {
        this.openPaymentModalBoutique();
        this.closeConfirmationBoutique();
      }
    },
    closeLoginModal() {
      this.showLoginModal = false;
    },
    handleLoginSuccess() {
      this.commandMessage = "Connexion réussie !";
    },
    handlePaymentSuccess() {
      const currentUser = this.$store.state.user.userSession;
      if (this.cart.length > 0) {
        const maxOrderNumber = Math.max(
          ...this.cart.map((article) => article.orderNumber || 0),
          ...this.getExistingOrderNumbers(),
          0
        );
        const ordersByRestaurant = this.cart.reduce((acc, article) => {
          const restaurantName = article.restaurant;
          const orderNumber = maxOrderNumber + Object.keys(acc).length + 1;
          const pickupTime = this.$refs.paymentForm.getPickupTime();
          if (!acc[restaurantName]) {
            acc[restaurantName] = {
              userId: currentUser.id,
              restaurantNom: restaurantName,
              orderNumber: orderNumber,
              articles: [],
              pickupTime: pickupTime,
            };
          }
          acc[restaurantName].articles.push(article);
          return acc;
        }, {});
        const newOrders = Object.values(ordersByRestaurant);
        this.setCurrentOrder(newOrders);
        newOrders.forEach((restaurantOrder) => {
          console.log('Commande:', restaurantOrder);
          this.addArticleOrder({
            ...restaurantOrder,
          });
        });
        this.commandMessage = "Paiement effectué. Votre commande a été confirmée !";
        const recap = this.$refs.paymentForm.generateRecap();
        if (recap) {
          console.log(recap);
          alert(recap);
        }
        this.$store.dispatch('resetCurrentOrder');
        this.cart = [];
        console.log("Panier vidé après paiement :", this.cart);
        this.closePaymentModal();
      }
    },
    getExistingOrderNumbers() {
      return this.$store.state.commandes.userOrders
        ? this.$store.state.commandes.userOrders.map((order) => order.orderNumber || 0)
        : [];
    },
    handlePaymentSuccessJeu() {
      const currentUser = this.$store.state.user.userSession;
      const maxOrderNumber = this.reservationsJeux.reduce((max, reservation) =>
        Math.max(max, reservation.orderNumber || 0), 0);
      this.reservationsJeux.push({
        jeuID: this.selectedModalJeu._id,
        userId: currentUser.id,
        orderNumber: maxOrderNumber + 1,
        prix: this.selectedModalJeu.prix,
      });
      this.commandMessage = "Paiement effectué. Votre réservation a été confirmée !";
      this.closeModalJeu();
      this.closeConfirmationBoutique();
      this.closePaymentModalBoutique();
    },
    deleteCommand() {
      this.cart = [];
      this.commandMessage = 'Votre commande a été effacée !'
    },
    closeCommandMessage() {
      this.commandMessage = '';
    },
    closeCardCommandMessage() {
      this.cardCommandMessage = '';
    },
    openPaymentModal() {
      this.showPaymentModal = true;
    },
    closePaymentModal() {
      this.showPaymentModal = false;
    },
    openPaymentModalBoutique() {
      this.showPaymentModalBoutique = true;
    },
    closePaymentModalBoutique() {
      this.showPaymentModalBoutique = false;
    },
    addToCart(article) {
      if (!article.nom || !article.prix || !article.image) {
        console.error("Article invalide :", article);
        return;
      }
      const itemInCart = this.cart.find(item => item.nom === article.nom);
      if (itemInCart) {
        itemInCart.quantite += 1;
      } else {
        this.cart.push({ ...article, quantite: 1, restaurant: this.selectedModalRestau.nom });
      }
      this.addMessage = `"${article.nom}" a été ajouté au panier !`;
      this.showAddModal = true;
      setTimeout(() => {
        this.showAddModal = false;
      }, 3000);
    },

    deleteArticle(article) {
      const itemInCartToDelete = this.cart.find(item => item.nom === article.nom);
      if (itemInCartToDelete) {
        itemInCartToDelete.quantite -= 1;
        if (itemInCartToDelete.quantite <= 0) {
          this.cart = this.cart.filter(item => item.nom !== article.nom);
          this.commandMessage = 'Article retiré du panier.'
        }
      }
    },
    submitComment() {
      if (this.newComment.trim()) {
        const comment = {
          id: Date.now(),
          texte: this.newComment,
          userId: this.$store.state.user.userSession.id,
        };
        if (this.editingComment) {
          const index = this.selectedModalRestau.commentaires.findIndex(c => c.id === this.editingComment.id);
          this.$set(this.selectedModalRestau.commentaires, index, comment);
          this.editingComment = null;
        } else {
          this.selectedModalRestau.commentaires.push(comment);
        }
        this.newComment = '';
      }
    },
    submitRating() {
  if (this.newRating >= 0 && this.newRating <= 5) {
    const rating = {
      userId: this.$store.state.user.userSession.id,
      valeur: this.newRating,
    };
    if (!this.selectedModalRestau.notes) {
      this.selectedModalRestau.notes = [];
    }
    this.selectedModalRestau.notes.push(rating);
    this.newRating = 0;
  } else {
    alert("La note doit être entre 0 et 5.");
  }
},
    editComment(comment) {
      this.newComment = comment.texte;
      this.editingComment = comment;
    },
    deleteComment(comment) {
      this.selectedModalRestau.commentaires = this.selectedModalRestau.commentaires.filter(c => c.id !== comment.id);
    },
    editRating(rating) {
      this.newRating = rating.rating;
      this.editingRating = rating;
    },
    deleteRating(rating) {
      this.selectedModalRestau.notes = this.selectedModalRestau.notes.filter(r => r.id !== rating.id);
      this.newRating = 0;
    },
  },
};
</script>

<style scoped>
.sendComment {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.comments {
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  border: 1px solid black;
}

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
  max-width: 600px;
  max-height: 60vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: left;
  position: relative;
  overflow-y: auto;
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
  width: 40px;
  height: 40px;
  margin-right: 10px;
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

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cart_list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.cart_item {
  display: grid;
  grid-template-columns: 35em 13em 13em 13em 30em;
  gap: 5px;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  padding: 8px 0;
}

.cart_item_image img {
  width: 70px;
  height: auto;
  border-radius: 5px;
}

.cart_item_info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
}

.cart_item_title {
  font-size: 18px;
  color: #888;
}

.cart_item_text {
  font-size: 20px;
  color: #333;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cart_item_quantity,
.cart_item_price {
  text-align: center;
  font-size: 14px;
  padding: 0;
  margin: 0;
}

.order_total {
  margin-top: 20px;
  padding: 10px 15px;
  background: #f1f1f1;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
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
  gap: 15px;
  padding: 15px;
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

.alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1em;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: opacity 0.5s ease-in-out;
}

.confirm-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.confirm-button:hover {
  background-color: #45a049;
}

.items-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin: 20px 0;
}

.item-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.item-card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.item-button-content {
  background: none;
  border: none;
  padding: 0;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.item-image {
  width: 100%;
  max-width: 120px;
  height: auto;
  border-radius: 5px;
  margin-bottom: 10px;
  object-fit: cover;
}
</style>