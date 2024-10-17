<template>
  <div class="mes-commandes">
    <h1 class="page-title">Mes Commandes</h1>
    
    <h2 class="section-title">Commandes de l'utilisateur</h2>
    <p v-if="!this.$store.state.tournois.length">Chargement des tournois...</p>
    <div class="cards-container" v-else-if="commandes && commandes.length">
      <div v-for="(commande, index) in commandes" :key="index" class="card">
        <div class="card-content">
          <h3 class="card-title">Tournoi: {{ commande.tournoiNom }}</h3>
          <p class="card-detail">Places réservées : {{ commande.places }}</p>
          <p class="card-status">Statut : {{ commande.status }}</p>
        </div>
      </div>
    </div>
    <p v-else>Aucune commande trouvée.</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PageMesCommandes",
  computed: {
    ...mapGetters(['userReservations', 'userSession']),
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
    }
  },
  mounted() {
    this.$store.dispatch('getAllTournois');
  },
};
</script>

<style scoped>
.mes-commandes {
  padding: 20px;
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.page-title {
  font-size: 2em;
  margin-bottom: 20px;
  color: #333;
}

.section-title {
  font-size: 1.5em;
  margin-bottom: 15px;
  color: #444;
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
</style>