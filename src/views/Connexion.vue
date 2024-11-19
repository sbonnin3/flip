<template>
  <section>
    <div class="form-box">
      <div class="form-value">
        <!-- Login / Registration Form Toggle -->
        <div class="auth-toggle">
          <button @click="toggleForm('login')" :class="{ active: isLogin }">Connexion</button>
          <button @click="toggleForm('signup')" :class="{ active: !isLogin }">Inscription</button>
        </div>

        <!-- Login Form -->
        <div v-if="isLogin">
          <h2>Login</h2>
          <form @submit.prevent="login">
            <div class="inputbox">
              <ion-icon name="mail-outline"></ion-icon>
              <input v-model="identifiant" type="text" required />
              <label for="identifiant">Email</label>
            </div>
            <div class="inputbox">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input v-model="motDePasse" type="password" required />
              <label for="motDePasse">Password</label>
            </div>
            <div class="forget">
              <label>
<!--                <input type="checkbox" /> Remember me-->
              </label>
              <label>
<!--                <a href="#">Forgot password?</a>-->
              </label>
            </div>
            <button type="submit">Log in</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          </form>
        </div>

        <!-- Registration Form -->
        <div v-else>
          <h2>Inscription</h2>
          <form @submit.prevent="register">
            <div class="inputbox">
              <ion-icon name="person-outline"></ion-icon>
              <input v-model="nom" type="text" required />
              <label for="nom">Nom</label>
            </div>
            <div class="inputbox">
              <ion-icon name="person-outline"></ion-icon>
              <input v-model="prenom" type="text" required />
              <label for="prenom">Prénom</label>
            </div>
            <div class="inputbox">
              <ion-icon name="mail-outline"></ion-icon>
              <input v-model="identifiant" type="text" required />
              <label for="identifiant">Email</label>
            </div>
            <div class="inputbox">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input v-model="motDePasse" type="password" required />
              <label for="motDePasse">Password</label>
            </div>
            <div class="inputbox">
              <select v-model="role" id="role">
                <option value="utilisateur">Utilisateur</option>
                <option value="restaurateur">Restaurateur</option>
                <option value="organisateur">Organisateur</option>
                <option value="vendeur">Vendeur</option>
                <option value="createur">Créateur</option>
                <option value="administrateur">Administrateur</option>
              </select>
            </div>
            <button type="submit">Register</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          </form>
        </div>

        <!-- Register Link for Login Form -->
        <div v-if="isLogin" class="register">
          <p>Don't have an account? <a href="#" @click="toggleForm('signup')">Register</a></p>
        </div>

        <!-- Register Link for Signup Form -->
        <div v-else class="register">
          <p>Already have an account? <a href="#" @click="toggleForm('login')">Login</a></p>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { mapActions } from "vuex";

export default {
  name: "PageInscription",
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
    ...mapActions(['setUserSession', 'addCompte']),

    toggleForm(formType) {
      this.isLogin = formType === 'login';
      this.errorMessage = "";
    },

    login() {
      const user = this.$store.getters.comptes.find(
          (compte) => compte.identifiant === this.identifiant && compte.motDePasse === this.motDePasse
      );
      if (user) {
        this.setUserSession(user);
        this.$router.push("/MonCompte");
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
        this.$router.push("/MonCompte");
      }
    },
  },
};
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  font-family: "Poppins", sans-serif;
}

section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: url("../assets/images/backgroundaccueil_3.jpg") no-repeat;
  background-position: center;
  background-size: cover;
}

.form-box {
  position: relative;
  width: 400px;
  min-height: 500px; /* Assure une hauteur suffisante pour le formulaire */
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(15px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  margin-top: 125px; /* Ajusté à 125px pour que le formulaire soit plus bas */
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
  width: 310px;
  border-bottom: 2px solid #fff;
}

.inputbox label {
  position: absolute;
  top: 0;
  left: 5px;
  color: #ffffff; /* Texte des labels en noir */
  font-size: 1em;
  pointer-events: none;
  transition: 0.3s;
}

.inputbox input:focus ~ label,
.inputbox input:valid ~ label {
  top: -20px;
  font-size: 0.8em;
  color: #fff;
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
  color: #fff; /* Texte des inputs en blanc */
}

.inputbox input:focus,
.inputbox select:focus {
  border-bottom: 2px solid #fff; /* Bordure blanche quand actif */
}

.inputbox ion-icon {
  position: absolute;
  right: 8px;
  color: #000;
  font-size: 1.2em;
  top: 20px;
}

.forget {
  display: flex;
  justify-content: space-between;
  margin: 10px 0 15px;
  font-size: 0.9em;
  color: #fff;
}

.forget label:nth-child(2) {
  order: 1;
}

.forget label {
  display: flex;
  align-items: center;
}

.forget label input[type="checkbox"] {
  margin-right: 6px;
}

.forget label a {
  color: #fff;
  text-decoration: none;
}

.forget label a:hover {
  text-decoration: underline;
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
  margin-top: 10px;
}

button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.register {
  font-size: 0.9em;
  color: #fff;
  text-align: center;
  margin: 25px 0 10px;
}

.register p a {
  text-decoration: none;
  color: #fff;
  font-weight: 600;
}

.register p a:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  font-size: 0.9em;
  text-align: center;
  margin-top: 10px;
}

/* Changer la couleur des éléments dans la liste déroulante (les options) en noir */
select > option {
  color: #000; /* Texte des options dans la liste en noir */
}

.inputbox > option {
  color: black;
}
</style>
