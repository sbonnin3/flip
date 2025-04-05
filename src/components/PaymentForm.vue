<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-container form-box">
      <button class="close-button" @click="closePaymentModal" aria-label="Fermer la fenêtre">✖</button>
      <div class="auth-container">
        <h2>Paiement</h2>
        <form @submit.prevent="processPayment">

          <label for="paymentType">Bienvenue sur la fenêtre de paiement en ligne. Veuillez sélectionner votre moyen de
            paiement ci-dessous :</label>

          <div class="selectedCard">
            <div class="selected-option" @click="toggleDropdown">
              {{ selected || "Choisir une option" }}
            </div>
            <ul v-if="dropdownOpen" class="options">
              <li v-for="option in options" :key="option" @click="selectOption(option)">
                {{ option }}
              </li>
            </ul>
          </div>

          <div v-if="selected === 'Carte Bancaire'">
            <div class="inputbox">
              <input v-model="paymentDetails.cardNumber" type="tel" placeholder="xxxx xxxx xxxx xxxx" maxlength="19"
                     id="cardNumber" required />
              <label for="cardNumber">Numéro de carte :</label>
            </div>
            <div class="inputbox">
              <input v-model="paymentDetails.expirationDate" type="tel" placeholder="MM/AA" maxlength="7"
                     id="expirationDate" required />
              <label for="expirationDate">Date d'expiration :</label>
            </div>
            <div class="inputbox">
              <input v-model="paymentDetails.cvv" type="tel" placeholder="123" maxlength="4" id="cvv" required />
              <label for="cvv">CVC :</label>
            </div>
            <div class="inputbox">
              <input v-model="paymentDetails.cardName" type="text" placeholder="PRENOM NOM" id="cardName" required />
              <label for="cardName">Propiétaire de la carte :</label>
            </div>
          </div>

          <div v-if="selected === 'PayPal'">
            <div class="inputbox">
              <input v-model="paymentDetails.paypalEmail" type="email" placeholder="paypal@gmail.com" id="paypalEmail"
                     required />
              <label for="paypalEmail">Email :</label>
            </div>
          </div>

          <div class="inputbox" v-if="selected && showPickupTime">
            <input v-model="pickupTime" type="time" id="pickupTime" />
            <label for="pickupTime">Heure de retrait souhaitée :</label>
          </div>

          <button type="submit" :disabled="!validatePayment()">Payer</button>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    showPickupTime: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      options: ["Carte Bancaire", "PayPal"],
      selected: "",
      dropdownOpen: false,
      paymentDetails: {
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        cardName: '',
        paypalEmail: '',
      },
      pickupTime: '',
      errorMessage: null,
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },

    selectOption(option) {
      this.selected = option;
      this.dropdownOpen = false;
      this.errorMessage = null;
      this.resetPaymentDetails();
    },

    resetPaymentDetails() {
      this.paymentDetails = {
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        cardName: '',
        paypalEmail: '',
      };
    },

    validatePayment() {
      if (this.selected === 'Carte Bancaire') {
        const cardValid = this.paymentDetails.cardNumber.replace(/\s/g, '').length === 16;
        const dateValid = /^\d{2}\/\d{2}$/.test(this.paymentDetails.expirationDate);
        const cvvValid = this.paymentDetails.cvv.length >= 3;
        return cardValid && dateValid && cvvValid && this.paymentDetails.cardName.trim() !== '';
      }
      if (this.selected === 'PayPal') {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.paymentDetails.paypalEmail);
      }
      return false;
    },

    processPayment() {
      if (!this.validatePayment()) {
        this.errorMessage = "Veuillez remplir tous les champs correctement.";
        return;
      }

      // Formatage des données avant envoi
      const paymentData = {
        method: this.selected,
        details: {...this.paymentDetails},
        timestamp: new Date().toISOString()
      };

      if (this.showPickupTime) {
        paymentData.pickupTime = this.pickupTime;
      }

      this.$emit("payment-success", paymentData);
      this.closePaymentModal();
    },

    closePaymentModal() {
      this.resetPaymentDetails();
      this.selected = "";
      this.errorMessage = null;
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  position: relative;
  width: 400px;
  min-height: 500px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(15px);
  padding: 20px;
}

.close-button {
  position: relative;
  background: transparent;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
  margin: 0;
}

.close-button:hover {
  color: #ff5555;
}

h2 {
  font-size: 2em;
  color: #fff;
  text-align: center;
  padding-bottom: 10px;
}

label {
  color: white;
  font-size: 1em;
}

.inputbox {
  position: relative;
  margin: 50px 0;
  width: 100%;
  border-bottom: 2px solid #fff;
}

.inputbox label {
  position: absolute;
  top: -20px;
  left: 5px;
  color: #ffffff;
  font-size: 1em;
  pointer-events: none;
  transition: 0.3s;
}

.inputbox input:focus~label,
.inputbox input:valid~label {
  top: -20px;
  font-size: 0.8em;
  color: white;
}

.inputbox input,
.inputbox select {
  width: 100%;
  height: 50px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1em;
  padding: 0 35px 0 5px;
  color: white;
}

.inputbox option {
  color: black;
}

.inputbox select {
  margin-top: 10px;
}

.selectedCard {
  position: relative;
  margin: 75px 0;
  width: 100%;
}

.selectedCard label {
  position: absolute;
  top: -20px;
  left: 5px;
  color: #ffffff;
  font-size: 1.2em;
}

.selected-option {
  padding: 0.5rem;
  border: 2px solid white;
  border-radius: 5px;
  background-color: transparent;
  color: white;
  cursor: pointer;
  text-align: center;
}

.selected-option:hover {
  background: rgba(255, 255, 255, 0.2);
}

.options {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 2px solid white;
  border-radius: 5px;
  background-color: transparent;
  position: absolute;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  z-index: 1000;
}

.options li {
  color: white;
  padding: 0.5rem;
  cursor: pointer;
  text-align: center;
}

.options li:hover {
  background: rgba(255, 255, 255, 0.2);
}

button {
  width: 100%;
  height: 40px;
  border-radius: 40px;
  background: transparent;
  border: 2px solid #fff;
  color: #fff;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  margin-bottom: 20px;
}

button:hover {
  background: rgba(255, 255, 255, 0.2);
}

p {
  color: red;
  font-size: 0.9em;
  text-align: center;
  margin-top: 10px;
}

.auth-container {
  max-height: 600px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 10px;
}

.auth-container::-webkit-scrollbar {
  width: 8px;
}

.auth-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
}

.auth-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.8);
}

.auth-container::-webkit-scrollbar-track {
  background: transparent;
}
</style>