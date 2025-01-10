<template>
  <div class="ventes-page">
    <h1>Commandes en cours</h1>

    <p v-if="!this.$store.state.jeux.length">Chargement des jeux...</p>

    <div class="cards-container" v-else-if="commandesJeu && commandesJeu.length">
      <h2 class="section-title">Toutes les ventes</h2>
      <div v-for="(commande, index) in commandesJeu" :key="index" class="card">
        <div class="card-content">
          <h3 class="card-title">Commande numéro {{ commande.orderNumber }}</h3>
          <div class="article">
            <p class="article-name">Nom du jeu : {{ commande.jeuNom }}</p>
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
  name: "PageCommandesBoutique",

  computed: {
    ...mapGetters(['allSells']),
    commandesJeu() {
      return this.allSells.map(reservationJeu => {
        const jeu = this.$store.state.jeux.find(j => j._id === reservationJeu.jeuID);
        return {
          ...reservationJeu,
          jeuNom: jeu ? jeu.name : 'Jeu inconnu',
          status: 'Confirmée',
        };
      });
    },
  },
  mounted() {
    this.$store.dispatch('getAllJeux');
  },
}
</script>

<style scoped>
.ventes-page {
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


.article-price {
  font-size: 0.95em;
  color: #666;
  margin: 5px 0;
}
</style>