<template>
  <div v-if="shouldShowModal" class="modal-overlay">
    <div class="modal-container form-box">
      <button class="close-button" @click="closeModal">✖</button>
      <div class="auth-container">
        <div v-if="isLogin">
          <h2>Connexion</h2>
          <form @submit.prevent="handleLogin">
            <div class="inputbox">
              <input v-model="identifiant" type="text" id="identifiant" required />
              <label for="identifiant">Identifiant:</label>
            </div>
            <div class="inputbox">
              <input v-model="motDePasse" type="password" id="motDePasse" required />
              <label for="motDePasse">Mot de Passe:</label>
            </div>
            <button type="submit">Se connecter</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          </form>
          <div class="auth-toggle">
            <button @click="toggleForm('signup')" :class="{ active: !isLogin }">M'inscrire</button>
          </div>
        </div>

        <div v-else>
          <h2>Inscription</h2>
          <form @submit.prevent="handleRegister">
            <div class="inputbox">
              <input v-model="nom" type="text" id="nom" required />
              <label for="nom">Nom:</label>
            </div>
            <div class="inputbox">
              <input v-model="prenom" type="text" id="prenom" required />
              <label for="prenom">Prénom:</label>
            </div>
            <div class="inputbox">
              <input v-model="email" type="email" id="email" required />
              <label for="email">Email:</label>
            </div>
            <div class="inputbox">
              <input v-model="identifiant" type="text" id="identifiant" required />
              <label for="identifiant">Identifiant:</label>
            </div>
            <div class="inputbox">
              <input v-model="motDePasse" type="password" id="motDePasse" required />
              <label for="motDePasse">Mot de Passe:</label>
            </div>
            <div class="inputbox">
              <label for="role">Rôle:</label>
              <select v-model="role" id="role">
                <option value="utilisateur">Utilisateur</option>
                <option value="restaurateur">Restaurateur</option>
                <option value="organisateur">Organisateur</option>
                <option value="vendeur">Vendeur</option>
                <option value="createur">Créateur</option>
              </select>
            </div>
            <div v-if="role !== 'utilisateur'" class="inputbox">
              <input v-model="codeInscription" type="text" id="codeInscription" required />
              <label for="codeInscription">Code d'inscription:</label>
            </div>
            <button type="submit">S'inscrire</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          </form>
          <div class="auth-toggle">
            <button @click="toggleForm('login')" :class="{ active: isLogin }">Connexion</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "ConnexionModal",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    shouldShowModal() {
      return this.visible && !this.isAuthenticated;
    },
    ...mapGetters("user", ["isAuthenticated"]),
    ...mapState("user", ["comptes"]),
  },
  data() {
    return {
      isLogin: true,
      nom: "",
      prenom: "",
      email: "",
      identifiant: "",
      motDePasse: "",
      role: "utilisateur",
      codeInscription: "",
      errorMessage: "",
    };
  },
  methods: {
    // On mappe les actions avec des alias pour éviter les conflits
    ...mapActions("user", {
      loginUser: "login",
      registerUser: "register"
    }),

    toggleForm(formType) {
      this.isLogin = formType === "login";
      this.errorMessage = "";
    },

    closeModal() {
      this.$emit("close");
    },

    async handleLogin() {
      try {
        const success = await this.loginUser({
          identifiant: this.identifiant,
          password: this.motDePasse,
        });

        if (success) {
          // Connexion réussie, fermer simplement la modal sans redirection
          this.closeModal();
        }
      } catch (error) {
        this.errorMessage = "Erreur de connexion";
      }
    },

    async handleRegister() {
      try {
        // 1. Nettoie la session actuelle avant l'inscription
        await this.$store.dispatch('user/logout');

        // 2. Envoi des données au serveur
        const success = await this.$store.dispatch('user/register', {
          nom: this.nom,
          prenom: this.prenom,
          email: this.email,
          motDePasse: this.motDePasse,
          role: this.role,
          identifiant: this.identifiant,
        });

        if (success) {
          const loginSuccess = await this.$store.dispatch('user/login', {
            identifiant: this.identifiant,
            password: this.motDePasse
          });

          if (loginSuccess) {
            this.$emit("register-success");
            this.closeModal();
          }
        }
      } catch (error) {
        this.errorMessage = "Erreur lors de l'inscription";
        console.error(error);
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
  margin-bottom: 20px;
}

.inputbox {
  position: relative;
  margin: 20px 0;
  width: 100%;
  border-bottom: 2px solid #fff;
}

.inputbox label {
  position: absolute;
  top: 0;
  left: 5px;
  color: #ffffff;
  font-size: 1em;
  pointer-events: none;
  transition: 0.3s;
}

.inputbox input:focus ~ label,
.inputbox input:valid ~ label {
  top: -10px;
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

.error-message {
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
