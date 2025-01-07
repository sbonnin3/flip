<template>
  <div class="commandes-page">
    <h1>{{this.standAttribue.nom}} - Commandes en cours</h1>

    <div v-if="articleCommandes.length === 0">
      <p>Aucune commande pour le moment.</p>
    </div>

    <div class="cards-container" v-if="articleCommandes && articleCommandes.length">
      <h2 class="section-title">Toutes les commandes</h2>
      <div v-for="(commande, index) in articleCommandes" :key="'commande-' + index" class="card">
        <div class="card-content">
          <h3 class="card-title">Commande n° {{ commande.orderNumber }}</h3>
          <div v-for="article in commande.articles" :key="article.nom" class="article">
            <p class="article-name">{{ article.nom }}</p>
            <p class="article-quantity">Quantité : {{ article.quantite }}</p>
            <p class="article-price">Prix : {{ article.prix }}€</p>
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
  name: "PageCommandes",
  computed: {
    ...mapGetters(['allOrders']), // Récupère toutes les commandes depuis Vuex
    currentUser() {
      return this.$store.state.userSession; // Restaurateur connecté
    },
    standAttribue() {
      // Trouve le stand correspondant au compte du restaurateur connecté
      if (!this.currentUser) {
        return null;
      }
      return this.$store.state.stands.find(stand => stand.comptes.includes(this.currentUser.id));
    },
    articleCommandes() {
      if (!this.standAttribue) {
        console.warn("Aucun stand attribué à l'utilisateur connecté.");
        return [];
      }

      // Filtre les commandes associées au stand du restaurateur
      return this.allOrders
          .filter(commande => commande.restaurantNom === this.standAttribue.nom)
          .map(commande => {
            return {
              ...commande,
              status: commande.status || 'À préparer.',
            };
          });
    },

  },
  mounted() {
    this.$store.dispatch('getAllStands');
    this.$store.dispatch('fetchAllOrders');
  },
};
</script>

<style scoped>
.commandes-page {
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