<template>
  <div class="mes-commandes">
    <h1 class="page-title">Mes Commandes</h1>

    <!-- Chargement des tournois -->
    <p v-if="!this.$store.state.tournois.length">Chargement des tournois...</p>

    <!-- Commandes de tournois -->
    <div class="cards-container" v-else-if="commandes && commandes.length">
      <h2 class="section-title">Commandes de tournois</h2>
      <div v-for="(commande, index) in commandes" :key="index" class="card">
        <div class="card-content">
          <h3 class="card-title">Tournoi de {{ commande.tournoiNom }}</h3>
          <div class="article">
            <p class="article-name">Places réservées : {{ commande.places }}</p>
            <p class="article-quantity">Date : {{commande.date}}</p>
            <p class="article-price">Prix : {{ commande.prix }}€</p>
          </div>
          <p class="card-status">{{ commande.status }}</p>
        </div>
      </div>
    </div>

    <!-- Commandes d'articles par restaurant -->
    <div class="cards-container" v-if="articleCommandes && articleCommandes.length">
      <h2 class="section-title">Commandes d'Articles</h2>
      <div v-for="(commande, index) in articleCommandes" :key="'commande-' + index" class="card">
        <div class="card-content">
          <h3 class="card-title">Commande n° {{ commande.orderNumber }} chez {{ commande.restaurantNom }}</h3>
          <!--h4 class="restaurant-name">Stand : {{ commande.restaurantNom }}</h4-->
          <div v-for="article in commande.articles" :key="article.nom" class="article">
            <p class="article-name">{{ article.nom }}</p>
            <p class="article-quantity">Quantité : {{ article.quantite }}</p>
            <p class="article-price">Prix : {{ article.prix }}€</p>
          </div>
          <p class="card-status">{{ commande.status }}</p>
        </div>
      </div>
    </div>

    <p v-if="!this.$store.state.jeux.length">Chargement des jeux...</p>

    <div class="cards-container" v-else-if ="commandesJeu && commandesJeu.length">
      <h2 class="section-title">Commandes de jeux</h2>
      <div v-for="(commande, index) in commandesJeu" :key="index" class="card">
        <div class="card-content">
          <h3 class="card-title">Nom du jeu : {{ commande.jeuNom }}</h3>
          <div class="article">
            <p class="article-price">Prix : {{ commande.prix }}€</p>
          </div>
          <p class="card-status">{{ commande.status }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PageMesCommandes",
  computed: {
    ...mapGetters(['userReservations', 'userReservationsJeux', 'userOrders', 'userSession']),
    commandes() {
      if (!this.userSession || !this.userReservations) {
        return [];
      }

      return this.userReservations.map(reservation => {
        const tournoi = this.$store.state.tournois.find(t => t._id === reservation.tournoiId);
        return {
          ...reservation,
          tournoiNom: tournoi ? tournoi.nom : 'Tournoi inconnu',
          status: 'Confirmée',
        };
      });
    },
    commandesJeu(){
      if (!this.userSession || !this.userReservationsJeux) {
        return [];
      }

      return this.userReservationsJeux.map(reservationJeu => {
        const jeu = this.$store.state.jeux.find(j => j._id === reservationJeu.jeuID);
        return {
          ...reservationJeu,
          jeuNom: jeu ? jeu.name : 'Jeu inconnu',
          status: 'Confirmée',
        };
      });
    },
    articleCommandes() {
      if (!this.userSession || !this.userOrders) {
        return [];
      }
      return this.userOrders.map(order => ({
        ...order,
        status: 'Payée. A chercher au stand.'
      }));
    },


  },
  mounted() {
    this.$store.dispatch('getAllTournois');
    this.$store.dispatch('getAllJeux');
  },
};
</script>

<style scoped>
.mes-commandes {
  padding-top: 100px;
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.page-title {
  font-size: 2em;
  margin-bottom: 20px;
  color: #333;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
}

.card-content {
  text-align: left;
}

.card-title {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #d22328;
}

.card-detail {
  font-size: 1em;
  margin-bottom: 5px;
  color: #555;
}

.card-status {
  font-size: 1em;
  color: #007bff;
}

.article {
  border-bottom: 1px solid #b6afaf;
  padding: 10px 0;
}

.article-name {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
}

.article-price {
  font-size: 0.95em;
  color: #666;
  margin: 5px 0;
}
</style>