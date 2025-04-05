<template>
  <div class="page-reservations">
    <div class="tournois-container">
      <h1 class="page-title">{{ $t('catalogue') }}</h1>

      <div class="tab-container">
        <button @click="selectTab('Jeux')" :class="{ active: selectedTab === 'Jeux' }">{{ $t('games') }}</button>
        <button @click="selectTab('Tournois')" :class="{ active: selectedTab === 'Tournois' }">{{ $t('tournaments') }}</button>
      </div>

      <ConnexionModal v-if="showLoginModal" :visible="showLoginModal" @close="closeLoginModal"
                      @login-success="handleLoginSuccess"/>

      <div v-show="selectedTab === 'Jeux'">
        <div class="search-container">
          <div class="search-row">
            <label for="searchName" class="search-label">{{ $t('gameName') }}:</label>
            <input id="searchName" type="text" v-model="searchName" :placeholder="$t('searchByName')"
                   class="search-input"/>
          </div>

          <div class="search-row">
            <label class="search-label">{{ $t('gameType') }}:</label>
            <div class="checkbox-container">
              <label v-for="type in jeuTypes" :key="type" class="checkbox-label">
                <input type="checkbox" v-model="selectedTypes" :value="type"/> {{ type }}
              </label>
            </div>
          </div>

          <div class="search-row">
            <label for="searchPlayers" class="search-label">{{ $t('playerCount') }}:</label>
            <input id="searchPlayers" type="number" v-model="searchPlayers" min="1" :placeholder="$t('playerCount')"
                   class="search-input"/>

            <label for="searchAge" class="search-label">{{ $t('minAge') }}:</label>
            <input id="searchAge" type="number" v-model="searchAge" min="1" :placeholder="$t('minAge')"
                   class="search-input"/>

            <label for="searchDuration" class="search-label">{{ $t('maxDuration') }}:</label>
            <input id="searchDuration" type="number" v-model="searchDuration" min="1"
                   :placeholder="$t('maxDurationMinutes')"
                   class="search-input"/>
          </div>

          <div class="search-row">
            <label for="searchStand" class="search-label">{{ $t('standName') }}:</label>
            <input id="searchStand" type="text" v-model="searchStand" :placeholder="$t('searchByStand')"
                   class="search-input"/>
          </div>

          <button @click="resetFilters" class="reset-button">{{ $t('resetFilters') }}</button>
        </div>

        <div class="cards-container" v-if="filteredJeux.length > 0">
          <div v-for="jeu in filteredJeux" :key="jeu.id" class="card" @click="openJeuModal(jeu)">
            <img :src="getJeuImage(jeu)" class="card-image" alt="image"/>
            <div class="card-content">
              <h2 class="card-title">{{ getJeuName(jeu) }}</h2>
              <p class="card-type">{{ $t('type') }}: {{ jeu.type || 'Non spécifié' }}</p>
              <p class="card-players">
                {{ $t('playerCount') }}: {{ jeu.nombre_joueurs_min }}-{{ jeu.nombre_joueurs_max }}
              </p>
              <p class="card-age">
                {{ $t('minAge') }}: {{ jeu.age_limite }} {{ $t('years') }}
              </p>
              <p class="card-duration">
                {{ $t('duration') }}: {{ jeu.duree }} min
              </p>
              <p class="card-stand" v-if="getStandName(jeu)">
                {{ $t('standName') }}: {{ getStandName(jeu) }}
              </p>
            </div>
          </div>
        </div>
        <p v-else>{{ $t('noGamesAvailable') }}</p>
      </div>

      <div id="Tournois" v-show="selectedTab === 'Tournois'">
        <div class="cards-container" v-if="tournois.length">
          <div v-for="tournoi in tournois" :key="tournoi._id" class="card" @click="openModal(tournoi)">
            <img :src="getTournoiImage(tournoi)" class="modal-image"/>
            <div class="card-content">
              <h2 class="card-title">{{ tournoi.nom_tournoi }}</h2>
              <p class="card-location">{{ tournoi.lieu }}</p>
              <p class="card-date">{{ getEditionForTournoi(tournoi).date_edition }}</p>
              <p class="card-price">{{ $t('price') }}: {{ tournoi.prix_entree }}€</p>
              <p class="card-places">
                {{ $t('remainingPlaces') }}: {{ getPlacesRestantes(tournoi.id) }}
              </p>
            </div>
          </div>
        </div>
        <p v-else>{{ $t('noTournamentsAvailable') }}</p>
      </div>

      <div v-if="selectedJeu" class="modal">
        <div class="modal-content">
          <span class="close-button" @click="closeJeuModal">&times;</span>
          <h2>{{ selectedJeu.name }}</h2>
          <img :src="getJeuImage(selectedJeu)" :alt="getJeuName(selectedJeu)" class="modal-image"/>
          <p><strong>{{ $t('type') }}:</strong> {{ selectedJeu.type }} </p>
          <p><strong>{{ $t('playerCount') }}:</strong> {{ selectedJeu.nombre_joueurs_max }} max</p>
          <p><strong>{{ $t('minAge') }}:</strong> {{ selectedJeu.age_minimum }} {{ $t('years') }}</p>
          <p><strong>{{ $t('duration') }}:</strong> {{ selectedJeu.duree }} {{ $t('minutes') }}</p>
          <p><strong>{{ $t('standName') }}:</strong> {{ getStandName(selectedJeu) }}</p>
          <button @click="openReservationJeuConfirmation" class="reset-button">{{ $t('reserve') }}</button>
        </div>
      </div>

      <div v-if="showConfirmationJeux" class="confirmation-modal">
        <div class="modal-content">
          <span class="close-button" @click="closeConfirmationJeux">&times;</span>
          <h2>{{ $t('confirmReservation') }}</h2>
          <p>
            {{
              $t('confirmGameReservation', {
                gameName: selectedJeu.name,
                standName: selectedJeu.nomsDesStands
              })
            }}
          </p>

          <div class="form-group">
            <label for="predefinedDate" class="inline-label">{{ $t('selectDate') }}:</label>
            <select id="predefinedDate" v-model="selectedDate" class="form-select">
              <option v-for="date in predefinedDates" :key="`${date.jour}-${date.mois}-${date.annee}`" :value="date">
                {{ formatDateJeux(date) }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="reservationTime" class="inline-label">{{ $t('enterTime') }}:</label>
            <input id="reservationTime" type="time" v-model="selectedTime" required class="form-input"/>
          </div>

          <div class="form-buttons">
            <button type="submit" class="confirm-button" @click="confirmReservationJeux">{{ $t('confirm') }}</button>
            <button type="button" @click="closeConfirmationJeux" class="cancel-button">{{ $t('cancel') }}</button>
          </div>
        </div>
      </div>

      <div v-if="selectedTournoi" class="modal">
        <div class="modal-content">
          <span class="close-button" @click="closeModal">&times;</span>
          <h2>{{ selectedTournoi.nom_tournoi }}</h2>
          <img :src="getTournoiImage(selectedTournoi)" class="modal-image"/>
          <p><strong>{{ $t('location') }}:</strong> {{ selectedTournoi.lieu }}</p>
          <p class="article-quantity">{{ $t('date') }}: {{ getEditionForTournoi(selectedTournoi).date_edition }}</p>
          <p><strong>{{ $t('description') }}:</strong> {{ selectedTournoi.description_tournoi }}</p>
          <p><strong>{{ $t('price') }}:</strong> {{ selectedTournoi.prix_entree }}€</p>
          <p class="card-places">
            {{ $t('totalRemainingPlaces') }}: {{ getPlacesRestantes(selectedTournoi.id) }}
          </p>
          <button class="reserve-button" @click="openReservationConfirmation">{{ $t('reserve') }}</button>
        </div>
      </div>

      <div v-if="showConfirmation" class="confirmation-modal">
        <div class="modal-content">
          <span class="close-button" @click="closeConfirmation">&times;</span>
          <h2>{{ $t('confirmReservation') }}</h2>
          <p>{{ selectedTournoi?.nom_tournoi }}</p>

          <form @submit.prevent="confirmReservation">
            <div>
              <p><strong>{{ $t('date') }}:</strong> {{ getEditionForTournoi(selectedTournoi).date_edition }}</p>
            </div>

            <div>
              <label for="teamName">{{ $t('teamName') }}:</label>
              <input id="teamName" type="text" v-model="teamName" :placeholder="$t('enterTeamName')" required/>
            </div>

            <div v-if="reservationMessage" class="error-message">
              <p>{{ reservationMessage }}</p>
            </div>

            <div class="form-buttons">
              <button type="submit" class="confirm-button">{{ $t('confirm') }}</button>
              <button type="button" @click="closeConfirmation" class="cancel-button">{{ $t('cancel') }}</button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="reservationMessage" class="reservation-message">
        <div class="modal-content">
          <p>{{ reservationMessage }}</p>
          <button @click="closeReservationMessage">OK</button>
        </div>
      </div>

<!--      <PaymentModal v-if="showPaymentModal" :visible="showPaymentModal" :showPickupTime="false"-->
<!--                    @close="closePaymentModal" @payment-success="handlePaymentSuccess"/>-->
    </div>
  </div>
</template>

<script>
import ConnexionModal from "@/components/Connexion.vue";
import {mapActions, mapState} from "vuex";

export default {
  name: 'PageActivites',
  components: {ConnexionModal},
  data() {
    return {
      selectedTab: 'Jeux',
      selectedJeu: null,
      selectedTournoi: null,
      showConfirmation: false,
      showConfirmationJeux: false,
      showLoginModal: false,
      showPaymentModal: false,
      reservationMessage: '',
      teamName: '',
      searchName: '',
      searchPlayers: '',
      searchAge: '',
      searchDuration: '',
      searchStand: '',
      selectedTypes: [],
      predefinedDates: this.generatePredefinedDates(),
      selectedDate: null,
      selectedTime: '',
    };
  },
  computed: {
    ...mapState("jeux", ["jeux"]),
    ...mapState("stands", ["stands"]),
    ...mapState("tournois", ["tournois", "editionsTournoi"]),
    reservations() {
      return this.$store.getters['reservations/reservations'];
    },
    reservationStandJeu() {
      return this.$store.getters['reservations/reservationStandJeu'];
    },
    tournois() {
      return this.$store.state.tournois.tournois || [];
    },
    stands() {
      return this.$store.state.stands.stands || [];
    },
    jeuTypes() {
      return [...new Set(this.jeux.map(jeu => jeu.type))];
    },
    filteredJeux() {
      if (!this.jeux || !Array.isArray(this.jeux)) return [];

      return this.jeux.filter(jeu => {
        if (!jeu || !jeu.produit) return false;

        const jeuNom = this.getJeuName(jeu)?.toLowerCase() || '';
        const jeuType = jeu.type ? jeu.type.toLowerCase() : '';
        const standNom = this.getStandName(jeu).toLowerCase();

        const nameMatch = !this.searchName ||
            jeuNom.includes(this.searchName.toLowerCase());

        const typeMatch = this.selectedTypes.length === 0 ||
            this.selectedTypes.map(t => t.toLowerCase()).includes(jeuType);

        const playersMatch = !this.searchPlayers || (
            jeu.nombre_joueurs_min <= Number(this.searchPlayers) &&
            jeu.nombre_joueurs_max >= Number(this.searchPlayers)
        );

        const ageMatch = !this.searchAge ||
            (jeu.age_limite || 0) <= Number(this.searchAge);

        const durationMatch = !this.searchDuration ||
            (jeu.duree || 0) <= Number(this.searchDuration);

        const standMatch = !this.searchStand ||
            standNom.includes(this.searchStand.toLowerCase());

        return nameMatch && typeMatch && playersMatch &&
            ageMatch && durationMatch && standMatch;
      });
    },
  },
  async created() {
    await this.$store.dispatch('stands/getAllStands');
    await this.$store.dispatch('reservations/fetchReservations');
    await this.$store.dispatch('reservations/fetchAllReservationsStand');
    await this.$store.dispatch('tournois/getAllTournois');
    await this.getAllJeux();
    await this.getEditionTournois();
  },
  methods: {
    ...mapActions("jeux", ["getAllJeux"]),
    ...mapActions("stands", ["getAllStands"]),
    ...mapActions("tournois", ["getAllTournois", "getEditionTournois", "inscriptionTournoi"]),

    getEditionForTournoi(tournoi) {
      if (!tournoi || !tournoi.id) return {date_edition: 'Date non disponible'};

      const edition = this.$store.state.tournois.editionsTournoi.find(
          ed => ed.id_tournoi === tournoi.id
      );

      if (!edition) return {date_edition: 'Date non disponible'};

      const formatDate = (dateString) => {
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } catch (e) {
          return dateString;
        }
      };

      return {
        ...edition,
        date_edition: formatDate(edition.date_edition)
      };
    },

    getStandName(jeu) {
      if (!jeu?.produit?.vendupar) return this.$t('unknownStand');
      const standId = jeu.produit.vendupar;
      const stand = this.$store.state.stands.stands.find(s =>
          s.id === standId || s.idStand == standId
      );
      return stand?.nom_stand || this.$t('unknownStand');
    },

    getJeuImage(jeu) {
      const path = jeu.produit.image_path;
      try {
        return require(`@/assets/images/${path}`);
      } catch {
        return require('@/assets/images/null.png');
      }
    },

    getTournoiImage(tournoi) {
      const path = tournoi.image_path;
      try {
        return require(`@/assets/images/${path}`);
      } catch {
        return require('@/assets/images/null.png');
      }
    },

    getJeuName(jeu) {
      return jeu.produit?.nom_produit || jeu.nom || 'Jeu sans nom';
    },

    openReservationConfirmation() {
      const currentUser = this.$store.state.user.userSession;
      if (currentUser) {
        this.showConfirmation = true;
      } else {
        this.showLoginModal = true;
      }
    },

    openReservationJeuConfirmation() {
      const currentUser = this.$store.state.user.userSession;
      if (currentUser) {
        this.showConfirmationJeux = true;
      } else {
        this.showLoginModal = true;
      }
    },

    async confirmReservation() {
      try {
        if (!this.teamName) {
          this.reservationMessage = this.$t('enterTeamName');
          return;
        }

        const currentUser = this.$store.state.user.actualUser;
        if (!currentUser?.id) {
          this.showLoginModal = true;
          return;
        }

        const edition = this.getEditionForTournoi(this.selectedTournoi);
        if (!edition || !edition.id) {
          this.reservationMessage = this.$t('noPlacesAvailable');
          return;
        }

        // Calcul des places restantes
        const capacitee = Number(edition.capacitee) || 0;
        const participants = Number(edition.current_participants) || 0;
        const placesRestantes = Math.max(0, capacitee - participants);

        if (placesRestantes === 0) {
          this.reservationMessage = this.$t('noPlacesAvailable');
          return;
        }
        await this.$store.dispatch('tournois/inscriptionTournoi', {
          id_utilisateur: currentUser.id,
          id_session: edition.id,
          nomEquipe: this.teamName,
        });

        this.reservationMessage = this.$t('reservationConfirmed');
        this.teamName = '';
        this.closeConfirmation();
        this.closeModal();

      } catch (error) {
        console.error("Erreur de réservation:", error);
        this.reservationMessage = error.message || this.$t('reservationError');
      }
    },

    // Les autres méthodes restent inchangées
    selectTab(tab) {
      this.selectedTab = tab;
    },
    resetFilters() {
      this.searchName = '';
      this.searchPlayers = '';
      this.searchAge = '';
      this.searchDuration = '';
      this.searchStand = '';
      this.selectedTypes = [];
    },
    openJeuModal(jeu) {
      this.selectedJeu = jeu;
    },
    closeJeuModal() {
      this.selectedJeu = null;
    },
    async openModal(tournoi) {
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
      this.selectedDate = null;
      this.selectedTime = '';
    },
    formatDate(dates) {
      if (Array.isArray(dates)) {
        return dates
            .map(date => {
              const heures = date.heures ? date.heures.toString().padStart(2, '0') : '00';
              const minutes = date.min ? date.min.toString().padStart(2, '0') : '00';
              const annee = date.annee || new Date().getFullYear();
              return `${date.jour}/${date.mois}/${annee} ${this.$t('at')} ${heures}:${minutes}`;
            })
            .join(', ');
      }
      return '';
    },
    formatTime(date) {
      const hour = date.heures ? date.heures.toString().padStart(2, '0') : '00';
      const minute = date.min ? date.min.toString().padStart(2, '0') : '00';
      return `${hour}:${minute}`;
    },
    isTeamNameTaken(teamName) {
      return this.reservations.some(
          (reservation) =>
              reservation.tournoiId === this.selectedTournoi.id &&
              reservation.teamName.toLowerCase() === teamName.toLowerCase()
      );
    },
    async confirmReservationJeux() {
      try {
        if (!this.selectedDate || !this.selectedTime) {
          alert(this.$t('selectDateAndTime'));
          return;
        }

        const currentUser = this.$store.state.user.actualUser;
        if (!currentUser?.id) {
          this.showLoginModal = true;
          return;
        }

        const [hours, minutes] = this.selectedTime.split(':').map(Number);
        const reservationDate = `${this.selectedDate.jour}/${this.selectedDate.mois}/${this.selectedDate.annee} ${hours}:${minutes}`;
        const reservationDatePrint = {
          ...this.selectedDate,
          heures: hours,
          min: minutes
        }

        const standId = this.selectedJeu.produit.vendupar;
        const stand = this.stands[standId];
        if (!stand) {
          throw new Error(this.$t('standNotFound'));
        }

        await this.$store.dispatch('reservations/addGameReservation', {
          idJeu: this.selectedJeu.id,
          idUtilisateur: currentUser.id,
          dateReserv: reservationDate,
        });

        const formattedDate = this.formatDateJeux(reservationDatePrint);
        const formattedTime = this.formatTime(reservationDate);
        this.reservationMessage = this.$t('reservationConfirmed', {
          date: formattedDate,
          time: formattedTime
        });
        this.closeConfirmationJeux();
        this.closeJeuModal();

      } catch (error) {
        console.error("Erreur de réservation:", error);
        this.reservationMessage = error.message || this.$t('reservationError');
      }
    },
    generatePredefinedDates() {
      const startDate = new Date(2025, 6, 9);
      const endDate = new Date(2025, 6, 20);
      const dates = [];

      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push({
          jour: d.getDate(),
          mois: d.getMonth() + 1,
          annee: d.getFullYear(),
        });
      }

      return dates;
    },
    formatDateJeux({jour, mois, annee}) {
      const formattedDay = jour.toString().padStart(2, '0');
      const formattedMonth = mois.toString().padStart(2, '0');
      return `${formattedDay}/${formattedMonth}/${annee}`;
    },
    resetReservationFields() {
      this.reservationDate = '';
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
      this.commandMessage = this.$t('loginSuccess');
    },
    closeReservationMessage() {
      this.reservationMessage = '';
    },
    getPlacesRestantes(tournoiId) {
      if (!tournoiId) return 0;

      // Vérifier si editionsTournoi est bien chargé
      if (!this.$store.state.tournois.editionsTournoi ||
          !Array.isArray(this.$store.state.tournois.editionsTournoi)) {
        console.error("EditionsTournoi non chargées ou format invalide");
        return 0;
      }

      const edition = this.$store.state.tournois.editionsTournoi.find(
          ed => ed.id_tournoi === tournoiId
      );

      if (!edition) {
        console.error("Edition non trouvée pour tournoi ID:", tournoiId);
        return 0;
      }

      // Vérifier que les valeurs sont bien des nombres
      const capacitee = Number(edition.capacitee) || 0;
      const participants = Number(edition.current_participants) || 0;

      return Math.max(0, capacitee - participants);
    }
  },
  mounted() {
    const selectedTab = this.$route.query.tab;
    if (selectedTab) {
      this.selectTab(selectedTab);
    }
    try {
      this.$store.dispatch('tournois/getEditionTournois');
      const editionTournois = this.$store.state.tournois.editionTournois;
      console.log('Edition Tournoi récupéré:', editionTournois);
    } catch (err) {
      console.error("Erreur lors de la récupération du tournoi:", err);
    }
  },
  watch: {
    '$route.query.tab'(newTab) {
      if (newTab) {
        this.selectTab(newTab);
      }
    }
  },
};
</script>

<style scoped>
/* Le CSS reste inchangé */
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

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.inline-label {
  margin-right: 15px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}

.form-select,
.form-input {
  flex: 1;
  max-width: 300px;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: #f04e23;
}

.confirm-button,
.cancel-button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
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