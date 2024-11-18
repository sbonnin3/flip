<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-container">
      <button class="close-button" @click="closeModal">✖</button>
      <div class="auth-container">
        <div class="auth-toggle">
          <button @click="toggleForm('login')" :class="{ active: isLogin }">Connexion</button>
          <button @click="toggleForm('signup')" :class="{ active: !isLogin }">Inscription</button>
        </div>

        <div v-if="isLogin">
          <h2>Connexion</h2>
          <form @submit.prevent="login">
            <div>
              <label for="identifiant">Identifiant:</label>
              <input v-model="identifiant" type="text" id="identifiant" required />
            </div>
            <div>
              <label for="motDePasse">Mot de Passe:</label>
              <input v-model="motDePasse" type="password" id="motDePasse" required />
            </div>
            <button type="submit">Se connecter</button>
            <p v-if="errorMessage">{{ errorMessage }}</p>
          </form>
        </div>

        <div v-else>
          <h2>Inscription</h2>
          <form @submit.prevent="register">
            <div>
              <label for="nom">Nom:</label>
              <input v-model="nom" type="text" id="nom" required />
            </div>
            <div>
              <label for="prenom">Prénom:</label>
              <input v-model="prenom" type="text" id="prenom" required />
            </div>
            <div>
              <label for="identifiant">Identifiant:</label>
              <input v-model="identifiant" type="text" id="identifiant" required />
            </div>
            <div>
              <label for="motDePasse">Mot de Passe:</label>
              <input v-model="motDePasse" type="password" id="motDePasse" required />
            </div>
            <div>
              <label for="role">Rôle:</label>
              <select v-model="role" id="role">
                <option value="utilisateur">Utilisateur</option>
                <option value="restaurateur">Restaurateur</option>
                <option value="organisateur">Organisateur</option>
                <option value="vendeur">Vendeur</option>
                <option value="createur">Créateur</option>
                <option value="administrateur">Administrateur</option>
              </select>
            </div>
            <button type="submit">S'inscrire</button>
            <p v-if="errorMessage">{{ errorMessage }}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ConnexionModal",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isLogin: true,
      nom: "",
      prenom: "",
      identifiant: "",
      motDePasse: "",
      role: "utilisateur",
      errorMessage: "",
    };
  },
  methods: {
    ...mapActions(["setUserSession", "addCompte"]),

    toggleForm(formType) {
      this.isLogin = formType === "login";
      this.errorMessage = "";
    },

    closeModal() {
      this.$emit("close");
    },

    login() {
      const user = this.$store.getters.comptes.find(
          (compte) =>
              compte.identifiant === this.identifiant &&
              compte.motDePasse === this.motDePasse
      );
      if (user) {
        this.setUserSession(user);
        this.$emit("login-success");
        this.closeModal();
      } else {
        this.errorMessage = "Identifiant ou mot de passe incorrect.";
      }
    },

    register() {
      const existingUser = this.$store.getters.comptes.find(
          (compte) => compte.identifiant === this.identifiant
      );
      if (existingUser) {
        this.errorMessage = "Cet identifiant est déjà utilisé.";
      } else {
        const newAccount = {
          id: Date.now(),
          nom: this.nom,
          prenom: this.prenom,
          identifiant: this.identifiant,
          motDePasse: this.motDePasse,
          role: this.role,
          telephone: "0102030405",
          photoProfil: "https://via.placeholder.com/150",
        };

        this.addCompte(newAccount);
        this.setUserSession(newAccount);
        this.$emit("register-success");
        this.closeModal();
      }
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
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.auth-toggle {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.auth-toggle button {
  padding: 10px 20px;
  cursor: pointer;
  background-color: #ddd;
  border: none;
  font-size: 16px;
  font-weight: bold;
}

.auth-toggle button.active {
  background-color: #4CAF50;
  color: white;
}

form div {
  margin-bottom: 10px;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

p {
  color: red;
}
</style>