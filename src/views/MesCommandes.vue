<template>
  <div class="mes-commandes">
    <h1 class="page-title">Mes Commandes</h1>

    <div class="tab-container">
      <button :class="{ active: selectedTab === 'Tournois' }" @click="selectTab('Tournois')">Tournois</button>
      <button :class="{ active: selectedTab === 'Articles' }" @click="selectTab('Articles')">Articles </button>
      <button :class="{ active: selectedTab === 'Jeux' }" @click="selectTab('Jeux')">Jeux</button>
      <button :class="{ active: selectedTab === 'JeuxReserve' }" @click="selectTab('JeuxReserve')">Jeux
        réservés</button>
    </div>

    <div v-show="selectedTab === 'Tournois'">
      <p v-if="$store.state.reservations.userReservations === null">
        Chargement en cours...
      </p>
      <p v-if="commandes.length === 0">
        Aucun tournoi réservé
      </p>
      <div v-else>
        <h2 class="section-title">Commandes de tournois</h2>
        <div v-for="(commande, index) in commandes" :key="index" class="card">
          <div class="card-content">
            <h3 class="card-title">Tournoi de {{ commande.tournoiNom }}</h3>
            <div class="article">
              <p class="article-name">Places réservées : {{ commande.places }}</p>
              <p class="article-quantity">
                Date : {{ formatReservationDate(commande.date || commande.dateReservation) }}
              </p>
              <p class="article-price">Prix : {{ commande.prix }}€</p>
              <p class="article-team">Nom de l'équipe : {{ commande.teamName || 'Aucun' }}</p>
            </div>
            <p class="card-status">{{ commande.status }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-show="selectedTab === 'Articles'">
      <p v-if="!userOrders">
        Chargement en cours...
      </p>
      <p v-else-if="articleCommandes.length === 0">
        Aucune commande d'articles
      </p>
      <div class="cards-container" v-else >
        <h2 class="section-title">Commandes d'Articles</h2>
        <div v-for="(commande, index) in articleCommandes" :key="'commande-' + index" class="card">
          <div class="card-content">
            <h3 class="card-title">Commande n° {{ commande.orderNumber }} chez {{ commande.restaurantNom }}</h3>
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

    <div v-show="selectedTab === 'Jeux'">
      <p v-if="$store.state.reservations.userReservationsJeux === null">
        Chargement en cours...
      </p>
      <p v-if="commandesJeu.length === 0">
        Aucun jeux réservé
      </p>
      <div v-else>
        <h2 class="section-title">Commandes de jeux</h2>
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

    <div v-show="selectedTab === 'JeuxReserve'">
      <p v-if="$store.state.reservations.userReservationStandJeu === null">
        Chargement en cours...
      </p>
      <p v-if="commandesStandJeu.length === 0">
        Aucun stand de jeu réservé
      </p>

      <div class="cards-container" v-else>
        <h2 class="section-title">Commandes de jeux</h2>
        <div v-for="(commande, index) in commandesStandJeu" :key="index" class="card">
          <div class="card-content">
            <h3 class="card-title">Stand : {{ commande.standName }}</h3>
            <div class="article">
              <p class="article-name">Nom du jeu : {{ commande.jeuNom }}</p>
              <p class="article-quantity">
                Date : {{ formatReservationDate(commande.date || commande.dateReservation) }}
              </p>
            </div>
            <p class="card-status">{{ commande.status }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PageMesCommandes",
  data() {
    return {
      selectedTab: "Tournois",
    }
  },
  async created() {
    await this.loadUserData();
  },

  computed: {
    ...mapGetters("reservations", ['userReservations', 'userReservationsJeux', 'userReservationStandJeu']),
    ...mapGetters("commandes", ['userOrders']),
    commandes() {
      const tournois = this.$store.state.tournois.tournois || [];
      const reservations = this.userReservations || [];

      return reservations.map(reservation => {
        const tournoi = tournois.find(t =>
            t.id === reservation.tournoiId ||
            t._id === reservation.tournoiId
        );

        return {
          ...reservation,
          tournoiNom: tournoi?.nom || `Tournoi ${reservation.tournoiId}`,
          status: 'Confirmée'
        };
      });
    },
    commandesJeu() {
      if (!this.userReservationsJeux) return [];
      return this.userReservationsJeux.map(reservation => {
        const jeu = (this.$store.state.jeux.jeux || [])
            .find(j =>
                j.id === reservation.jeuID ||
                j._id === reservation.jeuID);
        return {
          ...reservation,
          jeuNom: jeu ? jeu.nom : 'Jeu inconnu',
          status: 'Confirmée'
        };
      });
    },
    articleCommandes() {
      if (!this.userOrders) return []; // Protection ajoutée

      return this.userOrders.map(commande => {
        const stands = this.$store.state.stands?.stands || [];
        const restaurant = stands.find(s => s.nom === commande.restaurantNom);

        return {
          ...commande,
          restaurantNom: restaurant?.nom || 'Restaurant inconnu',
          status: commande.pickupTime
              ? `À récupérer à ${commande.pickupTime}`
              : 'Payée. A chercher au stand.',
          total: commande.articles.reduce((sum, art) => sum + (art.prix * art.quantite), 0)
        };
      });
    },
    commandesStandJeu() {
      if (!this.userReservationsStandJeu) return [];

      return this.userReservationsStandJeu.map(reservation => {
        const jeux = this.$store.state.jeux?.jeux || [];
        const stands = this.$store.state.stands?.stands || [];

        const jeu = jeux.find(j => j._id === reservation.jeuID || j.id === reservation.jeuID);
        const stand = stands.find(s => s._id === reservation.standID || s.idStand === reservation.standID);

        return {
          ...reservation,
          jeuNom: jeu ? jeu.nom || jeu.name : 'Jeu inconnu',
          standName: stand ? stand.nom : 'Stand inexistant',
          status: 'Confirmée'
        };
      });
    }
  },
  methods: {
    async loadUserData() {
      try {
        // Charge toutes les données utilisateur
        await this.$store.dispatch('reservations/fetchUserData');

        // Charge les autres données nécessaires
        await Promise.all([
          this.$store.dispatch('tournois/getAllTournois'),
          this.$store.dispatch('jeux/getAllJeux'),
          this.$store.dispatch('stands/getAllStands')
        ]);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      }
    },
    selectTab(tab) {
      this.selectedTab = tab;
    },
    formatReservationDate(date) {
      if (!date) return 'Date invalide';
      const {jour, mois, annee, heures, min} = date;

      if (jour !== undefined && mois !== undefined && annee !== undefined) {
        const formattedJour = jour.toString().padStart(2, '0');
        const formattedMois = mois.toString().padStart(2, '0');
        const formattedHeures = heures !== undefined ? heures.toString().padStart(2, '0') : '00';
        const formattedMinutes = min !== undefined ? min.toString().padStart(2, '0') : '00';

        return `${formattedJour}/${formattedMois}/${annee} à ${formattedHeures}h${formattedMinutes}`;
      }

      return 'Date invalide';
    },
  }
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