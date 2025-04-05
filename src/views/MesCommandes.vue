<template>
  <div class="mes-commandes">
    <h1 class="page-title">Mes Commandes</h1>

    <div class="tab-container">
      <button :class="{ active: selectedTab === 'Tournois' }" @click="selectTab('Tournois')">Tournois</button>
      <button :class="{ active: selectedTab === 'Articles' }" @click="selectTab('Articles')">Articles</button>
      <button :class="{ active: selectedTab === 'Jeux' }" @click="selectTab('Jeux')">Jeux</button>
      <button :class="{ active: selectedTab === 'JeuxReserve' }" @click="selectTab('JeuxReserve')">Jeux réservés</button>
    </div>

    <div v-show="selectedTab === 'Tournois'">
      <p v-if="$store.state.reservations.userReservations === null">
        Chargement en cours...
      </p>
      <p v-else-if="commandesTournois.length === 0">
        Aucun tournoi réservé
      </p>
      <div v-else>
        <h2 class="section-title">Commandes de tournois</h2>
        <div v-for="(commande, index) in commandesTournois" :key="index" class="card">
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
      <p v-else-if="commandesArticles.length === 0">
        Aucune commande d'articles
      </p>
      <div v-else>
        <h2 class="section-title">Commandes d'articles</h2>
        <div v-for="(commande, index) in commandesArticles" :key="index" class="card">
          <div class="card-content">
            <h3 class="card-title">Commande n°{{ commande.orderNumber }}</h3>
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
      <p v-else-if="commandesJeux.length === 0">
        Aucun jeu réservé
      </p>
      <div v-else>
        <h2 class="section-title">Commandes de jeux</h2>
        <div v-for="(commande, index) in commandesJeux" :key="index" class="card">
          <div class="card-content">
            <h3 class="card-title">Commande n°{{ commande.orderNumber }}</h3>
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
      <p v-if="loading">Chargement en cours...</p>
      <p v-else-if="reservationsJeux.length === 0">Aucun jeu réservé</p>
      <div v-else>
        <h2 class="section-title">Mes réservations de jeux</h2>
        <div v-for="reservation in reservationsJeux" :key="reservation.id" class="card">
          <div class="card-content">
            <h3 class="card-title">{{ getJeuNom(reservation.id_jeu) }}</h3>
            <div class="article">
              <p class="article-date">Date : {{ reservation.date_reservation }}</p>
              <p class="article-stand">Stand : {{ getStandName(reservation.id_jeu) }}</p>
            </div>
            <p class="card-status">Statut : Confirmée</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "PageMesCommandes",
  data() {
    return {
      selectedTab: "Tournois",
      loadingReservations: true
    };
  },
  async created() {
    await this.loadUserData();
  },
  computed: {
    ...mapGetters("reservations", ['userReservations', 'userReservationsJeux', 'userReservationStandJeu']),
    ...mapGetters("commandes", ['userOrders']),
    ...mapState(["jeux", "stands", "tournois"]),

    commandesTournois() {
      const reservations = this.userReservations || [];
      return reservations.map(reservation => {
        const tournoi = this.tournois.tournois?.find(t =>
            String(t.id) === String(reservation.tournoiId) ||
            String(t._id) === String(reservation.tournoiId)
        ) || {};

        return {
          ...reservation,
          tournoiNom: tournoi.nom || `[ID ${reservation.tournoiId}]`,
          status: 'Confirmée'
        };
      });
    },

    commandesArticles() {
      return this.userOrders || [];
    },

    commandesJeux() {
      return []
    },

    reservationsJeux() {
      return this.userReservationsJeux || [];
    }
  },
  methods: {
    async loadUserData() {
      try {
        this.loadingReservations = true;
        await Promise.all([
          this.$store.dispatch("reservations/getGameReservationByUserId", this.$store.state.user.actualUser.id),
          this.$store.dispatch("commandes/loadUserOrders"),
          this.$store.dispatch("jeux/getAllJeux"),
          this.$store.dispatch("stands/getAllStands"),
          // this.$store.dispatch("produits/getAllProduits"),
          this.$store.dispatch("tournois/getAllTournois")
        ]);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      } finally {
        this.loadingReservations = false;
      }
    },

    getJeuNom(jeuId) {
      const jeu = this.jeux.jeux?.find(j =>
          j.id === jeuId || j._id === jeuId
      );

      console.log("enieme test:" + JSON.stringify(jeu));

      // Vérification que le jeu existe
      if (!jeu) return this.$t('unknownGame');

      // Retour du nom du jeu ou une valeur par défaut
      return jeu.produit.nom_produit || this.$t('unknownGame');
    },

    getStandName(jeuId) {
      console.log("test reservation:" + JSON.stringify(this.reservationsJeux));
      const jeu = this.jeux.jeux?.find(j =>
          j.id === jeuId || j._id === jeuId
      );

      // Vérification que le jeu, son produit et vendupar existent
      if (!jeu?.produit?.vendupar) return this.$t('unknownStand');

      // Récupération de l'ID du stand
      const standId = jeu.produit.vendupar;

      // Recherche du stand dans le store
      const stand = this.$store.state.stands.stands.find(s =>
          s.id === standId || s.idStand == standId
      );

      // Retour du nom du stand ou une valeur par défaut
      return stand?.nom_stand || this.$t('unknownStand');
    },

    selectTab(tab) {
      this.selectedTab = tab;
    },

    formatReservationDate(date) {
      if (!date) return 'Date invalide';
      const {jour, mois, annee, heures, min} = date;

      if (jour !== undefined && mois !== undefined && annee !== undefined) {
        const formattedHeures = heures !== undefined ? (heures - 2).toString().padStart(2, '0') : '00';
        return `${jour.toString().padStart(2, '0')}/${mois.toString().padStart(2, '0')}/${annee} à ${formattedHeures}h${min?.toString().padStart(2, '0') || '00'}`;
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

.article-date,
.article-stand {
  font-size: 0.9em;
  color: #555;
  margin: 3px 0;
}
</style>