<template>
  <div class="commandes-page">
    <h1>Mon restaurant : {{ standAttribue?.nom || `Stand inconnu (ID: ${currentUser?.id})` }}</h1>

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
          <p class="card-status">Heure de retrait : {{ commande.pickupTime + "h" || "Non définie" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PageCommandes",
  data() {
    return {
      loading: true,
    };
  },
  async created() {
    await this.loadUserData();
  },

  computed: {
  ...mapGetters("commandes", ["allOrders"]),
  ...mapGetters("stands", ["getStandById", "stands"]), // Utilise le nouveau getter
  
    currentUser() {
      return this.$store.state.user.userSession;
    },

    standAttribue() {
      if (!this.currentUser) return null;
      return this.stands.find(stand =>
          stand.comptes?.includes(this.currentUser.id)
      ) || null;
    },

    articleCommandes() {
      if (!this.standAttribue?.nom) return [];
      return (this.allOrders || [])
        .filter(commande => commande.restaurantNom === this.standAttribue.nom)
        .map(commande => ({
          ...commande,
          status: commande.status || "À préparer",
          pickupTime: commande.pickupTime || "Non définie",
        }));
    },
  },
  methods: {
    async loadUserData() {
      try {
        await this.$store.dispatch('commandes/initOrders');
        await this.$store.dispatch('stands/getAllStands');
      } catch (error) {
        console.error("Erreur chargement données:", error);
      }
    }
  }
  // async mounted() {
  //   await Promise.all([
  //     this.getAllStands(),
  //     this.fetchAllOrders(),
  //   ]);
  //   this.loading = false;
  // },
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