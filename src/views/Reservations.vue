<template>
  <div class="reservations-page">
    <h1>Réservations de mes Tournois</h1>

    <!-- Si le prestataire n'a pas de réservations -->
    <div v-if="reservations.length === 0">
      <p>Aucune réservation pour vos tournois.</p>
    </div>

    <!-- Liste des réservations -->
    <div v-else>
      <table class="reservations-table">
        <thead>
          <tr>
            <th>Nom du Tournoi</th>
            <th>Date</th>
            <th>Nom de l'équipe</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in reservations" :key="reservation.reservationId">
            <td>{{ reservation.tournoiNom }}</td>
            <td>{{ formatDate(reservation.date || reservation.dateReservation) }}</td>
            <td>{{ reservation.teamName || 'Aucun' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PageReservationsPrestataire",
  computed: {
    ...mapGetters(["reservationsByPrestataire", "userSession", "comptes"]),
    reservations() {
      if (!this.userSession || this.userSession.role !== "organisateur") {
        console.warn("Aucun utilisateur ou rôle incorrect :", this.userSession);
        return [];
      }

      const reservations = this.reservationsByPrestataire(this.userSession.id);

      return reservations.map((reservation) => {
        const tournoi = this.$store.state.tournois.find(
          (t) => t._id === reservation.tournoiId
        );
        const participant = this.comptes.find(
          (compte) => compte.id === reservation.userId
        );

        return {
          ...reservation,
          tournoiNom: tournoi ? tournoi.nom : "Tournoi inconnu",
          participantNom: participant
            ? `${participant.prenom} ${participant.nom}`
            : "Participant inconnu",
        };
      });
    },
  },
  mounted() {
    console.log("Utilisateur connecté :", this.$store.state.userSession);
    console.log("Réservations disponibles :", this.$store.state.reservations);

    this.$store.dispatch('getAllTournois'); // Récupérer les tournois
  },
  methods: {
    formatDate(date) {
      if (!date) return "Date invalide";

      // Gérer le cas où la date est sous forme d'objet
      if (typeof date === 'object' && date.jour !== undefined) {
        const { jour, mois, annee, heures, min } = date;
        return `${jour.toString().padStart(2, '0')}/${mois.toString().padStart(2, '0')}/${annee} à ${heures?.toString().padStart(2, '0') || '00'}:${min?.toString().padStart(2, '0') || '00'}`;
      }

      // Gérer le cas où la date est au format ISO (chaîne)
      if (typeof date === 'string') {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate)) {
          return parsedDate.toLocaleDateString("fr-FR", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        }
      }

      // Si le champ est absent ou invalide
      return "Date invalide";
    },
  },
};
</script>


<style scoped>
.reservations-page {
  max-width: 800px;
  margin: 0 auto;
  margin-top: 100px;
  text-align: left;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.reservations-table {
  width: 100%;
  border-collapse: collapse;
}

.reservations-table th,
.reservations-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.reservations-table th {
  background-color: #f4f4f4;
}
</style>
