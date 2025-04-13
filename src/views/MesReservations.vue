<template>
  <div class="mesReservations-page">
    <h1>{{ this.userStand.nom_stand || 'Mon Stand' }} - Réservations de mes jeux</h1>
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
import {mapState} from "vuex";

export default {
  name: "PagesMesReservations",
  computed: {
    ...mapState("jeux", ["jeux"]),
    ...mapState("stands", ["stands"]),
    ...mapState("reservations", ["reservations"]),
    ...mapState("user", ["actualUser"]),

    filteredUserJeux() {
      if (!this.userStand) return [];
      return this.jeux.filter(jeu => {
        return jeu.produit && jeu.produit.vendupar === this.userStand.id;
      });
    },

    reservationStandJeu() {
      if (!this.userStand || !this.reservations || !this.jeux) return [];

      // Récupérer tous les jeux du stand
      const jeuxStand = this.jeux.filter(jeu => {
        return jeu.produit && jeu.produit.vendupar === this.userStand.id;
      });

      // Filtrer les réservations qui concernent ces jeux
      return this.reservations
          .filter(reservation => {
            return jeuxStand.some(jeu => jeu.id === reservation.id_jeu);
          })
          .map(reservation => {
            const jeu = jeuxStand.find(j => j.id === reservation.id_jeu);
            return {
              reservationJeuStandId: reservation.id,
              jeuNom: jeu?.produit?.nom_produit || 'Jeu inconnu',
              date: reservation.date_reservation,
              status: 'Réservé' // Vous pouvez ajouter plus de logique pour le statut
            };
          });
    },

    userStand() {
      if (!this.actualUser || !this.stands) return null;
      return this.stands.find(stand =>
          stand.comptes.includes(this.actualUser.id)
      );
    },

    currentUser() {
      return this.actualUser;
    },
  },

  async created() {
    await this.$store.dispatch('user/initComptes');
    await this.$store.dispatch('jeux/getAllJeux');
    await this.$store.dispatch('stands/getAllStands');
    await this.$store.dispatch('reservations/getGameReversations');

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