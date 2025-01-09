<template>
  <div class="page-reservations">
    <div class="tournois-container">
      <h1 class="page-title">Catalogue</h1>

      <div class="tab-container">
        <button @click="selectTab('Jeux')" :class="{ active: selectedTab === 'Jeux' }">Jeux</button>
        <button @click="selectTab('Tournois')" :class="{ active: selectedTab === 'Tournois' }">Tournois</button>
      </div>
      <ConnexionModal v-if="showLoginModal" :visible="showLoginModal" @close="closeLoginModal"
        @login-success="handleLoginSuccess" />
      <div v-show="selectedTab === 'Jeux'">
        <div class="search-container">
          <div class="search-row">
            <label for="searchName" class="search-label">Nom de jeu :</label>
            <input id="searchName" type="text" v-model="searchName" placeholder="Rechercher par nom de jeu"
              class="search-input" />
          </div>

          <div class="search-row">
            <label class="search-label">Type de jeu :</label>
            <div class="checkbox-container">
              <label v-for="type in jeuTypes" :key="type" class="checkbox-label">
                <input type="checkbox" v-model="selectedTypes" :value="type" /> {{ type }}
              </label>
            </div>
          </div>

          <div class="search-row">
            <label for="searchPlayers" class="search-label">Nombre de joueurs :</label>
            <input id="searchPlayers" type="number" v-model="searchPlayers" min="1" placeholder="Nombre de joueurs"
              class="search-input" />

            <label for="searchAge" class="search-label">Âge minimum :</label>
            <input id="searchAge" type="number" v-model="searchAge" min="1" placeholder="Âge minimum"
              class="search-input" />

            <label for="searchDuration" class="search-label">Durée max :</label>
            <input id="searchDuration" type="number" v-model="searchDuration" min="1" placeholder="Durée max (minutes)"
              class="search-input" />
          </div>

          <div class="search-row">
            <label for="searchEditeur" class="search-label">Nom de l'éditeur :</label>
            <input id="searchEditeur" type="text" v-model="searchEditeur" placeholder="Rechercher par nom d'éditeur"
              class="search-input" />
            <label for="searchStand" class="search-label">Nom de stand :</label>
            <input id="searchStand" type="text" v-model="searchStand" placeholder="Rechercher par nom de stand"
              class="search-input" />
          </div>

          <button @click="resetFilters" class="reset-button">Réinitialiser les filtres</button>
        </div>

        <div class="cards-container" v-if="filteredJeux.length">
          <div v-for="jeu in filteredJeux" :key="jeu.name" class="card" @click="openJeuModal(jeu)">
            <img :src="jeu.image" alt="Image du jeu" class="card-image" />
            <div class="card-content">
              <h2 class="card-title">{{ jeu.name }}</h2>
              <p class="card-type">Type : {{ jeu.type }}</p>
              <p class="card-players">Nombre de joueurs : {{ jeu.nombre_de_joueurs.join(', ') }}</p>
              <p class="card-age">Âge minimum : {{ jeu.age_minimum }} ans</p>
              <p class="card-duration">Durée : {{ jeu.duree }} min</p>
              <p class="card-stand">Nom du stand : {{ jeu.nomsDesStands }}</p>
            </div>
          </div>
        </div>
        <p v-else>Aucun jeu disponible.</p>
      </div>

      <div id="Tournois" v-show="selectedTab === 'Tournois'">
        <div class="cards-container" v-if="tournois.length">
          <div v-for="tournoi in tournois" :key="tournoi._id" class="card" @click="openModal(tournoi)">
            <img :src="tournoi.image" alt="Image du tournoi" class="card-image" />
            <div class="card-content">
              <h2 class="card-title">{{ tournoi.nom }}</h2>
              <p class="card-location">{{ tournoi.lieu }}</p>
              <p class="card-date">{{ formatDate(tournoi.dates) }}</p>
              <p class="card-price">Prix: {{ tournoi.prix }}€</p>
              <p class="card-places">
                Places restantes : {{ getPlacesRestantes(tournoi._id) }}
              </p>
            </div>
          </div>
        </div>
        <p v-else>Aucun tournoi disponible.</p>
      </div>

      <div v-if="selectedJeu" class="modal">
        <div class="modal-content">
          <span class="close-button" @click="closeJeuModal">&times;</span>
          <h2>{{ selectedJeu.name }}</h2>
          <img :src="selectedJeu.image" alt="Image du jeu" class="modal-image" />
          <p><strong>Type :</strong> {{ selectedJeu.type }}</p>
          <p><strong>Nombre de joueurs :</strong> {{ selectedJeu.nombre_de_joueurs.join(', ') }}</p>
          <p><strong>Âge minimum :</strong> {{ selectedJeu.age_minimum }} ans</p>
          <p><strong>Durée :</strong> {{ selectedJeu.duree }} minutes</p>
          <p><strong>Éditeur :</strong> {{ selectedJeu.editeur }}</p>
          <p><strong>Nom du stand :</strong> {{ selectedJeu.nomsDesStands }}</p>
          <button @click="openReservationJeuConfirmation" class="reset-button">Réserver</button>
        </div>
      </div>

      <div v-if="showConfirmationJeux" class="confirmation-modal">
        <div class="modal-content">
          <span class="close-button" @click="closeConfirmationJeux">&times;</span>
          <h2>Confirmer la réservation</h2>
          <p>Voulez-vous vraiment réserver le jeu {{ selectedJeu.name }} au stand {{ selectedJeu.nomsDesStands }} ?</p>

            <div class="form-buttons">
              <button type="submit" class="confirm-button" @click="confirmReservationJeux">Confirmer</button>
              <button type="button" @click="closeConfirmationJeux" class="cancel-button">Annuler</button>
            </div>
        </div>
      </div>

      <div v-if="selectedTournoi" class="modal">
        <div class="modal-content">
          <span class="close-button" @click="closeModal">&times;</span>
          <h2>{{ selectedTournoi.nom }}</h2>
          <img :src="selectedTournoi.image" alt="Image du tournoi" class="modal-image" />
          <p><strong>Lieu :</strong> {{ selectedTournoi.lieu }}</p>
          <p class="article-quantity">Date : {{ formatReservationDate(selectedTournoi.dates[0]) }}</p>
          <p><strong>Description :</strong> {{ selectedTournoi.description }}</p>
          <p><strong>Prix :</strong> {{ selectedTournoi.prix }}€</p>
          <p class="card-places">
            Total des places restantes : {{ getPlacesRestantes(selectedTournoi._id) }}
          </p>
          <button class="reserve-button" @click="openReservationConfirmation">Réserver</button>
        </div>
      </div>

      <div v-if="showConfirmation" class="confirmation-modal">
        <div class="modal-content">
          <span class="close-button" @click="closeConfirmation">&times;</span>
          <h2>Confirmer la réservation</h2>
          <p>Choisissez une date pour le tournoi {{ selectedTournoi?.nom || '' }} :</p>

          <form v-if="selectedTournoi?.dates" @submit.prevent="confirmReservation">
            <div>
              <label for="reservationDate">Date :</label>
              <select id="reservationDate" v-model="reservationDate" required>
                <option v-for="date in selectedTournoi.dates"
                  :key="`${date.jour}-${date.mois}-${date.annee}-${date.heures}-${date.min}`" :value="date">
                  {{ formatReservationDate(date) }} - {{ date.placesRestantes }} places restantes
                </option>
              </select>
            </div>

            <div>
              <label for="teamName">Nom de l'équipe :</label>
              <input id="teamName" type="text" v-model="teamName" placeholder="Entrez le nom de votre équipe"
                required />
            </div>

            <div v-if="reservationMessage" class="error-message">
              <p>{{ reservationMessage }}</p>
            </div>

            <div class="form-buttons">
              <button type="submit" class="confirm-button">Confirmer</button>
              <button type="button" @click="closeConfirmation" class="cancel-button">Annuler</button>
            </div>
          </form>
          <p v-else>Aucune date disponible pour ce tournoi.</p>
        </div>
      </div>

      <div v-if="reservationMessage" class="reservation-message">
        <div class="modal-content">
          <p>{{ reservationMessage }}</p>
          <p v-if="reservationDate">
            <strong>Date de venue :</strong> {{ formatReservationDate(reservationDate) }}
          </p>
          <p v-if="reservationDate">
            <strong>Heure :</strong> {{ formatTime(reservationDate) }}
          </p>
          <button @click="closeReservationMessage">OK</button>
        </div>
      </div>

      <PaymentModal v-if="showPaymentModal" :visible="showPaymentModal" :showPickupTime="false"
        @close="closePaymentModal" @payment-success="handlePaymentSuccess" />

    </div>
  </div>
</template>

<script>
import { reservations, tournois, jeux, stands, reservationStandJeu } from '@/datasource/data';
import ConnexionModal from "@/components/Connexion.vue";
import PaymentModal from "@/components/PaymentForm.vue";

export default {
  name: 'PageActivites',
  components: { PaymentModal, ConnexionModal },
  data() {
    return {
      selectedTab: 'Jeux',
      reservationDate: null,
      selectedJeu: null,
      selectedTournoi: null,
      showConfirmation: false,
      showConfirmationJeux: false,
      showLoginModal: false,
      showPaymentModal: false,
      pickupTime: '',
      reservationMessage: '',
      reservations,
      reservationStandJeu,
      tournois,
      jeux,
      stands,
      teamName: '',
      searchName: '',
      searchPlayers: '',
      searchAge: '',
      searchDuration: '',
      searchEditeur: '',
      searchStand: '',
      selectedTypes: [],
      jeuTypes: [...new Set(jeux.map(jeu => jeu.type))],
    };
  },
  created() {
    // Ajouter le champ nomStand dans chaque jeu
    this.jeux = jeux.map(jeu => {
      // Vérifiez si `nom_stand` est défini et est un tableau
      const nomsDesStands = Array.isArray(jeu.nom_stand)
          ? jeu.nom_stand.map(idStand => {
            const stand = stands.find(s => s.idStand === idStand);
            return stand ? stand.nom : "Stand inconnu"; // Retourne "Stand inconnu" si aucun stand n'est trouvé
          })
          : [];

      return {
        ...jeu,
        nomsDesStands: nomsDesStands.join(", "), // Combine les noms en une chaîne
      };
    });
  },
  computed: {
    filteredJeux() {
      return this.jeux.filter(jeu => {
        const nameMatch = jeu.name.toLowerCase().includes(this.searchName.toLowerCase());
        const typeMatch = this.selectedTypes.length ? this.selectedTypes.includes(jeu.type) : true;
        const playersMatch = this.searchPlayers ? jeu.nombre_de_joueurs.includes(Number(this.searchPlayers)) : true;
        const ageMatch = this.searchAge ? jeu.age_minimum <= Number(this.searchAge) : true;
        const durationMatch = this.searchDuration ? jeu.duree <= Number(this.searchDuration) : true;
        const editeurMatch = jeu.editeur.toLowerCase().includes(this.searchEditeur.toLowerCase());
        const standMatch = jeu.nomsDesStands.toLowerCase().includes(this.searchStand.toLowerCase());

        return nameMatch && typeMatch && playersMatch && ageMatch && durationMatch && editeurMatch && standMatch;
      });
    },
  },
  methods: {
    selectTab(tab) {
      this.selectedTab = tab;
    },
    resetFilters() {
      this.searchName = '';
      this.searchPlayers = '';
      this.searchAge = '';
      this.searchDuration = '';
      this.searchEditeur = '';
      this.searchStand = '';
      this.selectedTypes = [];
    },
    openJeuModal(jeu) {
      this.selectedJeu = jeu;
    },
    closeJeuModal() {
      this.selectedJeu = null;
    },
    openModal(tournoi) {
      this.selectedTournoi = tournoi;
    },
    closeModal() {
      this.selectedTournoi = null;
    },
    closeConfirmation() {
      this.showConfirmation = false;
    },
    closeConfirmationJeux() {
      this.showConfirmationJeux = false;
    },
    formatDate(dates) {
      if (Array.isArray(dates)) {
        return dates
          .map(date => {
            const heures = date.heures ? date.heures.toString().padStart(2, '0') : '00';
            const minutes = date.min ? date.min.toString().padStart(2, '0') : '00';
            const annee = date.annee || new Date().getFullYear(); // Utilise l'année actuelle si elle n'est pas définie
            return `${date.jour}/${date.mois}/${annee} à ${heures}:${minutes}`;
          })
          .join(', ');
      }
      return '';
    },
    // Formatage de l'heure (appelé par formatDate)
    formatTime(date) {
      const hour = date.heures ? date.heures.toString().padStart(2, '0') : '00';
      const minute = date.min ? date.min.toString().padStart(2, '0') : '00';
      return `${hour}:${minute}`;
    },

    // Formate une date pour les options de réservation
    formatReservationDate(date) {
      if (!date || !date.jour || !date.mois || !date.annee) {
        return 'Date invalide';
      }

      const jour = date.jour.toString().padStart(2, '0'); // Ajout du zéro si nécessaire
      const mois = date.mois.toString().padStart(2, '0'); // Ajout du zéro si nécessaire
      const heures = date.heures ? date.heures.toString().padStart(2, '0') : '00';
      const minutes = date.min ? date.min.toString().padStart(2, '0') : '00';

      return `${jour}/${mois}/${date.annee} à ${heures}:${minutes}`;
    },
    openReservationConfirmation() {
      const currentUser = this.$store.state.userSession;
      if (currentUser) {
        this.reservationDate = null; // Réinitialise la sélection
        this.showConfirmation = true;
      } else {
        this.showLoginModal = true;
      }
    },
    openReservationJeuConfirmation() {
      const currentUser = this.$store.state.userSession;
      if (currentUser) {
        this.showConfirmationJeux = true;
      } else {
        this.showLoginModal = true;
      }
    },
    isTeamNameTaken(teamName) {
      return this.reservations.some(
        (reservation) =>
          reservation.tournoiId === this.selectedTournoi._id &&
          reservation.teamName.toLowerCase() === teamName.toLowerCase()
      );
    },

    confirmReservation() {
      if (!this.reservationDate || !this.teamName) {
        this.reservationMessage = 'Veuillez sélectionner une date et entrer un nom d\'équipe.';
        return;
      }

      // Vérifie si le nom d'équipe existe déjà
      if (this.isTeamNameTaken(this.teamName)) {
        this.reservationMessage = `Le nom d'équipe "${this.teamName}" est déjà pris. Veuillez en choisir un autre.`;
        return;
      }

      // Trouver la date spécifique dans le tournoi sélectionné
      const selectedDate = this.selectedTournoi.dates.find(
        (date) =>
          date.jour === this.reservationDate.jour &&
          date.mois === this.reservationDate.mois &&
          date.annee === this.reservationDate.annee &&
          date.heures === this.reservationDate.heures &&
          date.min === this.reservationDate.min
      );

      if (!selectedDate || selectedDate.placesRestantes === 0) {
        this.reservationMessage = 'Désolé, il ne reste plus de places disponibles pour cette date.';
        return;
      }

      // Réduire le nombre de places restantes pour cette date
      selectedDate.placesRestantes -= 1;

      // Ajouter la réservation
      const currentUser = this.$store.state.userSession;
      this.reservations.push({
        tournoiId: this.selectedTournoi._id,
        userId: currentUser.id,
        places: 1,
        prix: this.selectedTournoi.prix,
        dateReservation: { ...this.reservationDate },
        teamName: this.teamName,
      });

      this.reservationMessage = "Paiement effectué. Votre réservation a été confirmée !";
      this.teamName = ''; // Réinitialiser le champ du nom d'équipe
      this.closeConfirmation(); // Fermer le modal
      this.openPaymentModal();
      this.closeModal();
    },
    confirmReservationJeux() {
      const currentUser = this.$store.state.userSession;
      const stand = this.$store.state.stands.find(s => s.nom === this.selectedJeu.nomsDesStands && s.type === "stand de jeux");
      this.reservationStandJeu.push({
        jeuID: this.selectedJeu._id,
        standID: stand.idStand,
        userId: currentUser.id,
      })
      this.reservationMessage = "Réservation confirmée !"
      this.closeConfirmationJeux();
      this.closeJeuModal();
    },
    resetReservationFields() {
      this.reservationDate = '';
    },
    handlePaymentSuccess() {
      const placesRestantes = this.getPlacesRestantes(this.selectedTournoi._id, this.selectedTournoi.placesLimite);
      if (placesRestantes > 0) {
        const currentUser = this.$store.state.userSession;
        if (currentUser) {
          this.reservations.push({
            tournoiId: this.selectedTournoi._id,
            userId: currentUser.id,
            places: 1,
            prix: this.selectedTournoi.prix,
            date: this.formatDate(this.selectedTournoi.dates),
          });
        } else {
          this.showLoginModal = true;
        }
        this.reservationMessage = "Paiement effectué. Votre réservation a été confirmée !";
        this.closePaymentModal();
        this.closeModal();
      }
    },

    openPaymentModal() {
      this.showPaymentModal = true;
    },

    closePaymentModal() {
      this.showPaymentModal = false;
    },

    closeLoginModal() {
      this.showLoginModal = false;
    },
    handleLoginSuccess() {
      this.showLoginModal = false;
      this.commandMessage = "Connexion réussie !";
    },
    closeReservationMessage() {
      this.reservationMessage = '';
    },
    getPlacesRestantes(tournoiId) {
      const tournoi = this.tournois.find((t) => t._id === tournoiId);
      if (!tournoi) return 0;

      // Calculer la somme des places restantes pour toutes les dates
      return tournoi.dates.reduce((total, date) => total + (date.placesRestantes || 0), 0);
    },

  },
  mounted() {
    // Vérifie si un paramètre `tab` est présent dans l'URL au moment du chargement de la page
    const selectedTab = this.$route.query.tab;
    if (selectedTab) {
      this.selectTab(selectedTab);
    }
  },
  watch: {
    // Surveille les changements de l'URL pour mettre à jour l'onglet si nécessaire
    '$route.query.tab'(newTab) {
      if (newTab) {
        this.selectTab(newTab);
      }
    }
  },
};
</script>

<style scoped>
.reservation-message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-message p {
  color: red;
  font-weight: bold;
  margin: 10px 0;
}

.reservation-message .modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.reservation-message button {
  background-color: #f04e23;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  margin-top: 10px;
}

.reservation-message button:hover {
  background-color: #d83d1a;
}

.tournois-container {
  padding-top: 100px;
  text-align: center;
}

.page-title {
  font-size: 2em;
  margin-bottom: 20px;
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
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.05);
  background-color: #fce012;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 15px;
}

.card-title {
  font-size: 1.5em;
  margin: 10px 0;
}

.card-type,
.card-players,
.card-age,
.card-duration,
.card-stand,
.card-location,
.card-date,
.card-price,
.card-places {
  font-size: 1em;
  color: #555;
  margin: 5px 0;
}

.modal,
.reservation-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fff;
  margin-top: 50px;
  padding: 20px;
  border-radius: 10px;
  width: 30%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: left;
  position: relative;
  overflow-y: auto;
  max-height: 70vh;
}

.modal-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin-bottom: 20px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
}

.reserve-button {
  background-color: #f04e23;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reserve-button:hover {
  background-color: #d83d1a;
}

form {
  display: flex;
  flex-direction: column;
}

form label {
  margin: 10px 0 5px;
}

form input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

form button {
  align-self: flex-start;
}

.search-input {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 180px;
}

.checkbox-container {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 10px 0;
}

.checkbox-label {
  margin-right: 15px;
}

.reset-button {
  background-color: #f04e23;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: auto;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reset-button:hover {
  background-color: #d83d1a;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.search-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.search-label {
  font-weight: bold;
  margin-right: 10px;
}

.confirmation-modal,
.reservation-message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirmation-modal .modal-content,
.reservation-message .modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.confirm-button,
.cancel-button {
  background-color: #f04e23;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.confirm-button:hover {
  background-color: #d83d1a;
}

.cancel-button:hover {
  background-color: #555;
}
</style>