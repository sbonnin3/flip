<template>
  <div class="mes-commandes">
    <h1 class="page-title">Mes Commandes</h1>

    <div class="tab-container">
      <button :class="{ active: selectedTab === 'Tournois' }" @click="selectTab('Tournois')">Tournois</button>
      <button :class="{ active: selectedTab === 'Articles' }" @click="selectTab('Articles')">Articles </button>
      <button :class="{ active: selectedTab === 'Jeux' }" @click="selectTab('Jeux')">Jeux</button>
      <button :class="{ active: selectedTab === 'JeuxReserve' }" @click="selectTab('JeuxReserve')">Jeux réservés</button>
    </div>

    <div v-show="selectedTab === 'Tournois'">
      <!-- Chargement des tournois -->
      <p v-if="!this.$store.state.tournois.length">Chargement des tournois...</p>

      <!-- Commandes de tournois -->
      <div v-if="commandes && commandes.length">
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
    </div>

    <div v-show="selectedTab === 'Jeux'">
      <p v-if="!this.$store.state.jeux.length">Chargement des jeux...</p>

      <div class="cards-container" v-else-if="commandesJeu && commandesJeu.length">
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
      <p v-if="!this.$store.state.jeux.length">Chargement des jeux...</p>

      <div class="cards-container" v-else-if="commandesStandJeu && commandesStandJeu.length">
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
  data(){
    return {
      selectedTab: "Tournois",
    }
  },
  computed: {
    ...mapGetters(['userReservations', 'userReservationsJeux', 'userReservationsStandJeu', 'userOrders']),
    commandes() {
      const commandes = this.userReservations.map(reservation => {
        const tournoi = this.$store.state.tournois.find(t => t._id === reservation.tournoiId);
        return {
          ...reservation,
          tournoiNom: tournoi ? tournoi.nom : 'Tournoi inconnu',
          status: 'Confirmée',
        };
      });
      console.log('Commandes:', commandes);
      return commandes;
    },
    commandesJeu() {
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
      return this.userOrders.map(commandes => {
        const restaurant = this.$store.state.stands.find(s => s.nom === commandes.restaurantNom);
        console.log('Restaurant trouvé:', restaurant);  // Vérifie si le restaurant est bien trouvé
        return {
          ...commandes,
          restaurantNom: restaurant ? restaurant.nom : 'Restaurant inconnu',
          status: 'Payée. A chercher au stand.',
        };
      });
    },
    commandesStandJeu() {
      return this.userReservationsStandJeu.map(reservationStandJeu => {
        const jeu = this.$store.state.jeux.find(j => j._id === reservationStandJeu.jeuID);
        const stand = this.$store.state.stands.find(s => s.idStand === reservationStandJeu.standID);
        return {
          ...reservationStandJeu,
          jeuNom: jeu ? jeu.name : 'Jeu inconnu',
          standName: stand ? stand.nom : 'Stand inexistant',
          status: 'Confirmée',
        };
      });
    }
  },
  methods: {
    selectTab(tab) {
      this.selectedTab = tab;
    },
    formatReservationDate(date) {
      if (!date) return 'Date invalide';

      // Vérifier si la date est un objet réactif avec les propriétés nécessaires
      const { jour, mois, annee, heures, min } = date;

      if (jour !== undefined && mois !== undefined && annee !== undefined) {
        const formattedJour = jour.toString().padStart(2, '0');
        const formattedMois = mois.toString().padStart(2, '0');
        const formattedHeures = heures !== undefined ? heures.toString().padStart(2, '0') : '00';
        const formattedMinutes = min !== undefined ? min.toString().padStart(2, '0') : '00';

        return `${formattedJour}/${formattedMois}/${annee} à ${formattedHeures}h${formattedMinutes}`;
      }

      return 'Date invalide';
    },
  },
  mounted() {
    this.$store.dispatch('getAllTournois');
    this.$store.dispatch('getAllJeux');
    this.$store.dispatch('getAllStands');
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