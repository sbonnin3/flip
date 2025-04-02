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
            <td>{{ formatDate(reservation.date || reservation.dateReservation) }}</td>
            <td>{{ reservation.teamName || 'Aucun' }}</td>
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
export default {
  name: "PageReservationsPrestataire",
  data() {
    return {
      loading: true
    };
  },
  computed: {
    userSession() {
      return this.$store.state.user.userSession;
    },
    reservations() {
      if (!this.userSession || this.userSession.role !== "organisateur") {
        console.warn("Accès refusé - Rôle organisateur requis");
        return [];
      }

      // Accès direct aux données pour plus de fiabilité
      const allReservations = this.$store.state.reservations.reservations || [];
      const allTournois = this.$store.state.tournois.tournois || [];
      const allComptes = this.$store.state.user.comptes || [];

      return allReservations
        .filter(reservation => {
          const tournoi = allTournois.find(t => t._id === reservation.tournoiId);
          return tournoi && tournoi.prestataireId === this.userSession.id;
        })
        .map(reservation => {
          const tournoi = allTournois.find(t => t._id === reservation.tournoiId);
          const participant = allComptes.find(c => c.id === reservation.userId);

          return {
            ...reservation,
            tournoiNom: tournoi?.nom || "Tournoi inconnu",
            participantNom: participant 
              ? `${participant.prenom} ${participant.nom}`
              : "Participant inconnu"
          };
        });
    }
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
    formatDate(date) {
      if (!date) return "Date invalide";

      if (typeof date === 'object' && date.jour !== undefined) {
        const { jour, mois, annee, heures, min } = date;
        return `${jour.toString().padStart(2, '0')}/${mois.toString().padStart(2, '0')}/${annee} à ${heures?.toString().padStart(2, '0') || '00'}:${min?.toString().padStart(2, '0') || '00'}`;
      }

      return "Date invalide";
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