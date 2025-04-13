<template>
  <div class="reservations-page">
    <h1>Réservations de mes Tournois</h1>

    <div v-if="loading">
      <p>Chargement en cours...</p>
    </div>
    <div v-else-if="reservations.length === 0">
      <p>Aucune réservation pour vos tournois.</p>
    </div>
    <div v-else>
      <table class="reservations-table">
        <thead>
          <tr>
            <th>Nom du Tournoi</th>
            <th>Date</th>
            <th>Nom de l'équipe</th>
            <th>Participant</th>
            <th>Places</th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in reservations" :key="reservation.id">
            <td>{{ reservation.tournoiNom }}</td>
            <td>{{ formatDateIso(reservation.date) }}</td>
            <td>{{ reservation.teamName }}</td>
            <td>{{ reservation.participantNom }}</td>
            <td>{{ reservation.places }}</td>
            <td>{{ reservation.prix }}€</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {updatePrestataireService} from "../services/serviceapi/prestataire";

export default {
  name: "PageReservationsPrestataire",
  data() {
    return {
      loading: true
    };
  },
  computed: {
    ...mapState("stands", ["stands"]),
    ...mapState("user", ["actualUser"]),
    ...mapState("tournois", ["tournois", "editionsTournoi", "inscriptionsTournoi"]),
    userStand() {
      if (!this.actualUser || !this.stands) return null;
      return this.stands.find(stand =>
          stand.comptes.includes(this.actualUser.id)
      );
    },
    userSession() {
      return this.$store.state.user.actualUser;
    },
    reservations() {
      return this.inscriptionsTournoi?.filter(inscription =>
          this.editionsTournoi?.some(edition =>
              edition.id === inscription.id_edition_tournoi &&
              this.tournois?.some(tournoi =>
                  tournoi.id === edition.id_tournoi &&
                  tournoi.id_stand === this.userStand?.id
              )
          )
      )?.map(inscription => ({
        id: inscription.id,
        tournoiNom: this.tournois.find(t => t.id === this.editionsTournoi.find(e => e.id === inscription.id_edition_tournoi)?.id_tournoi)?.nom_tournoi || 'Inconnu',
        date: this.editionsTournoi.find(e => e.id === inscription.id_edition_tournoi)?.date_edition,
        teamName: inscription.nomequipe || 'Aucun',
        participantNom: (this.$store.state.user.comptes?.find(c => c.id === inscription.id_utilisateur)?.prenom || '') + ' ' +
            (this.$store.state.user.comptes?.find(c => c.id === inscription.id_utilisateur)?.nom || '') || 'Inconnu',
        places: 1,
        prix: this.tournois.find(t => t.id === this.editionsTournoi.find(e => e.id === inscription.id_edition_tournoi)?.id_tournoi)?.prix_entree || 0
      })) || [];
    }
  },

  async created() {
    await this.$store.dispatch('user/initComptes');
    await this.$store.dispatch('tournois/getAllTournois');
    await this.$store.dispatch('stands/getAllStands');
    await this.$store.dispatch('tournois/getAllReservationTournois');
    await this.$store.dispatch('tournois/getEditionTournois');
    console.log("TEST RESERVATIONS: " + JSON.stringify(this.reservations));
    console.log("TEST TOURNO" + JSON.stringify(this.tournois));
    console.log("TEST EDITIONS" + JSON.stringify(this.editionsTournoi));
    console.log("TEST INSCRIPTIONS" + JSON.stringify(this.inscriptionsTournoi));
  },
  async mounted() {
    try {
      await Promise.all([
        this.$store.dispatch('tournois/fetchTournois'),
        this.$store.dispatch('reservations/fetchReservations')
      ]);
    } catch (error) {
      console.error("Erreur de chargement:", error);
    } finally {
      this.loading = false;
    }
    
    // Debug: Affiche les données dans la console
    console.log("Données chargées:", {
      user: this.userSession,
      reservations: this.$store.state.reservations.reservations,
      tournois: this.$store.state.tournois.tournois,
      comptes: this.$store.state.user.comptes
    });
  },
  methods: {
    updatePrestataireService,
    formatDateIso(dateString) {
      const date = new Date(dateString);

      // Options de formatage
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };

      return date.toLocaleDateString('fr-FR', options).replace(',', ' à');
    }
  }
};
</script>

<style scoped>
.reservations-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.reservations-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 3px rgba(0,0,0,0.1);
}

.reservations-table th,
.reservations-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.reservations-table th {
  background-color: #3498db;
  color: white;
  font-weight: bold;
}

.reservations-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.reservations-table tr:hover {
  background-color: #e6f7ff;
}

.loading-message {
  text-align: center;
  font-style: italic;
  color: #7f8c8d;
}

.no-reservations {
  text-align: center;
  font-size: 1.1em;
  color: #e74c3c;
  padding: 20px;
}
</style>