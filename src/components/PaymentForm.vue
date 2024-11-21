<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-container form-box">
      <button class="close-button" @click="closePaymentModal">✖</button>
      <div class="auth-container">
          <h2>Paiement</h2>
          <form @submit.prevent="processPayment">
            <div class="inputbox">
              <input v-model="cardNumber" type="text" placeholder="1234 5678 9012 3456" id="cardNumber" required/>
              <label for="cardNumber">Numéro de carte :</label>
            </div>
            <div class="inputbox">
              <input v-model="expirationDate" type="text" placeholder="MM/AA" id="expirationDate" required/>
              <label for="expirationDate">Date d'expiration :</label>
            </div>
            <div class="inputbox">
              <input v-model="cvv" type="text" placeholder="123" id="cvv" required/>
              <label for="cvv">CVV :</label>
            </div>
            <button type="submit">Payer</button>
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
  },
  data() {
    return {
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      errorMessage: null,
    };
  },
  methods: {
    processPayment() {
      // Ajouter ici la logique pour envoyer les données à l'API
      if (!this.cardNumber || !this.expirationDate || !this.cvv) {
        this.errorMessage = "Veuillez remplir tous les champs.";
        return;
      }
      this.$emit("payment-success");
      this.closePaymentModal();
    },
    closePaymentModal() {
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

.inputbox input:focus ~ label,
.inputbox input:valid ~ label {
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
  max-height: 600px; /* Hauteur maximale pour éviter que le contenu déborde */
  overflow-x: hidden;  /* Active la barre de défilement verticale si nécessaire */
  overflow-y: auto;
  padding-right: 10px; /* Ajout d'un espace pour éviter que la barre de défilement ne masque le contenu */
}

.auth-container::-webkit-scrollbar {
  width: 8px; /* Largeur de la barre de défilement */
}

.auth-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.5); /* Couleur de la barre */
  border-radius: 10px; /* Pour un style arrondi */
}

.auth-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.8); /* Couleur de la barre au survol */
}

.auth-container::-webkit-scrollbar-track {
  background: transparent; /* Fond transparent pour le track */
}
</style>
