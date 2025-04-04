<template>
  <div class="mesReservations-page">
    <h1>{{ standAttribue?.nom || 'Mon Stand' }} - Réservations de mes jeux</h1>
    <div v-if="reservationStandJeu.length === 0">
      <p>Aucune réservation pour vos jeux.</p>
    </div>
    <div v-else>
      <table class="reservations-table">
        <thead>
        <tr>
          <th>Nom du Jeu</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="reservation in reservationStandJeu" :key="reservation.reservationJeuStandId">
          <td>{{ reservation.jeuNom }}</td>
          <td>{{ formatDate(reservation.date || reservation.dateReservation) }}</td>
          <td>{{ reservation.status }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PagesMesReservations",
  computed: {
    ...mapGetters('reservations', ['allReservationsStand']),
    ...mapGetters('stands', ['getStandByUserId']),
    ...mapGetters('jeux', ['allJeux']),

    currentUser() {
      return this.$store.state.userSession;
    },
    standAttribue() {
      if (!this.currentUser) return null;
      return this.getStandByUserId(this.currentUser.id);
    },
    reservationStandJeu() {
      if (!this.standAttribue?.idStand) return [];
      
      return (this.allReservationsStand || [])
        .filter(reservation => reservation.standID === this.standAttribue.idStand)
        .map(reservation => {
          const jeu = this.allJeux.find(j => j._id === reservation.jeuID);
          return {
            ...reservation,
            jeuNom: jeu?.name || 'Jeu inconnu',
            status: reservation.status || 'Préparer la table',
          };
        });
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return "Date invalide";

      if (typeof date === 'object' && date.jour !== undefined) {
        const { jour, mois, annee, heures, min } = date;
        return `${jour.toString().padStart(2, '0')}/${mois.toString().padStart(2, '0')}/${annee} à ${heures?.toString().padStart(2, '0') || '00'}h${min?.toString().padStart(2, '0') || '00'}`;
      }
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
      return "Date invalide";
    },
  },
  async mounted() {
    await Promise.all([
      this.$store.dispatch('jeux/getAllJeux'),
      this.$store.dispatch('stands/getAllStands'),
      this.$store.dispatch('reservations/fetchAllReservationsStand'),
    ]);
  },
}
</script>

<style scoped>
.mesReservations-page {
  padding-top: 100px;
  max-width: 800px;
  margin: auto;
  text-align: center;
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