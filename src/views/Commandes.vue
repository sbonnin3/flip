<template>
  <div class="commandes-page">
    <h1>Commandes en cours</h1>

    <div v-if="articleCommandes.length === 0">
      <p>Aucune commandes pour le moment.</p>
    </div>

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

  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "PageCommandes",
  computed: {
    ...mapGetters(['userOrders']),
    articleCommandes() {
      return this.userOrders.map(order => ({
        ...order,
      }));
    },
  }
}

</script>

<style scoped>
.commandes-page {
  max-width: 800px;
  margin: 0 auto;
  margin-top: 100px;
  text-align: left;
}
h1 {
  text-align: center;
  margin-bottom: 20px;
}

</style>