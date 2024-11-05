<template>
    <div class="reservations-page">
      <h1>Mes Réservations</h1>
  
      <!-- Si l'utilisateur n'a pas de réservations -->
      <div v-if="reservations.length === 0">
        <p>Aucune réservation pour le moment.</p>
      </div>
  
      <!-- Liste des réservations -->
      <div v-else>
        <table class="reservations-table">
          <thead>
            <tr>
              <th>Événement</th>
              <th>Date</th>
              <th>Lieu</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reservation in reservations" :key="reservation.id">
              <td>{{ reservation.eventName }}</td>
              <td>{{ formatDate(reservation.date) }}</td>
              <td>{{ reservation.location }}</td>
              <td>
                <button @click="cancelReservation(reservation.id)" class="cancel-button">
                  Annuler
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "PageReservations",
    data() {
      return {
        // Placeholder pour les réservations
        reservations: [
          {
            id: 1,
            eventName: "Tournoi de Football",
            date: "2024-11-15",
            location: "Stade Municipal",
          },
          {
            id: 2,
            eventName: "Tournoi de Tennis",
            date: "2024-11-22",
            location: "Club de Tennis",
          },
          // Ajouter d'autres réservations ici
        ],
      };
    },
    methods: {
      // Formater la date au format lisible
      formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
      },
  
      // Fonction pour annuler une réservation
      cancelReservation(id) {
        const confirmed = confirm("Êtes-vous sûr de vouloir annuler cette réservation ?");
        if (confirmed) {
          this.reservations = this.reservations.filter(reservation => reservation.id !== id);
          alert("Votre réservation a été annulée.");
        }
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
  
  .cancel-button {
    background-color: #ff4d4d;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .cancel-button:hover {
    background-color: #e60000;
  }
  </style>
  