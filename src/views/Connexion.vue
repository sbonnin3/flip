<template>
  <section>
    <div class="form-box">
      <div class="form-value">
        <div v-if="isLogin">
          <h2>{{ $t('loginTitle') }}</h2>
          <form @submit.prevent="handleLogin">
            <div class="inputbox">
              <ion-icon name="mail-outline"></ion-icon>
              <input v-model="identifiant" type="text" required />
              <label for="identifiant">{{ $t('username') }}</label>
            </div>
            <div class="inputbox">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input v-model="motDePasse" type="password" required />
              <label for="motDePasse">{{ $t('password') }}</label>
            </div>
            <button type="submit">{{ $t('loginButton') }}</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          </form>
        </div>

        <div v-else>
          <h2>{{ $t('registerTitle') }}</h2>
          <form @submit.prevent="handleRegister">
            <div class="inputbox">
              <ion-icon name="person-outline"></ion-icon>
              <input v-model="nom" type="text" required />
              <label for="nom">{{ $t('lastName') }}</label>
            </div>
            <div class="inputbox">
              <ion-icon name="person-outline"></ion-icon>
              <input v-model="prenom" type="text" required />
              <label for="prenom">{{ $t('firstName') }}</label>
            </div>
            <div class="inputbox">
              <ion-icon name="mail-outline"></ion-icon>
              <input v-model="email" type="email" required />
              <label for="email">{{ $t('email') }}</label>
            </div>
            <div class="inputbox">
              <ion-icon name="mail-outline"></ion-icon>
              <input v-model="identifiant" type="text" required />
              <label for="identifiant">{{ $t('username') }}</label>
            </div>
            <div class="inputbox">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input v-model="motDePasse" type="password" required />
              <label for="motDePasse">{{ $t('password') }}</label>
            </div>
            <div class="inputbox">
              <select v-model="role" id="role">
                <option value="utilisateur">{{ $t('user') }}</option>
                <option value="restaurateur">{{ $t('restaurateur') }}</option>
                <option value="organisateur">{{ $t('organizer') }}</option>
                <option value="vendeur">{{ $t('seller') }}</option>
                <option value="createur">{{ $t('creator') }}</option>
              </select>
            </div>
            <div v-if="role !== 'utilisateur'" class="inputbox">
              <ion-icon name="key-outline"></ion-icon>
              <input v-model="codeInscription" type="text" required />
              <label for="codeInscription">{{ $t('registrationCode') }}</label>
            </div>
            <button type="submit">{{ $t('registerButton') }}</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          </form>
        </div>

        <div v-if="isLogin" class="register">
          <p>{{ $t('noAccount') }} <a href="#" @click="toggleForm('signup')">{{ $t('registerLink') }}</a></p>
        </div>
        <div v-else class="register">
          <p>{{ $t('haveAccount') }} <a href="#" @click="toggleForm('login')">{{ $t('loginLink') }}</a></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "PageInscription",
  data() {
    return {
      codeInscription: "",
      isLogin: true,
      nom: "",
      prenom: "",
      email: "",
      identifiant: "",
      motDePasse: "",
      role: "utilisateur",
      errorMessage: "",
    };
  },
  computed: {
    ...mapState("user", ["comptes"]),
  },
  methods: {
    ...mapActions("user", ["login", "register"]),

    toggleForm(formType) {
      this.isLogin = formType === "login";
      this.errorMessage = "";
    },

    async handleLogin() {
      try {
        const success = await this.login({
          identifiant: this.identifiant,
          password: this.motDePasse
        })

        if (success) {
          await new Promise(resolve => setTimeout(resolve, 50)) // Attente cycle mise à jour
          const targetPath = this.$store.state.user.redirectPath || '/MonCompte'
          this.$store.dispatch('user/clearRedirectPath')

          if (this.$route.path === targetPath) {
            window.location = targetPath
          } else {
            this.$router.replace(targetPath).catch(() => {})
          }
        }
      } catch (error) {
        this.errorMessage = "Erreur de connexion"
      }
    },

    async handleRegister() {
      if (!this.email.includes("@")) {
        this.errorMessage = this.$t('emailError');
        return;
      }

      if (this.role !== "utilisateur" && this.codeInscription !== "1234") {
        this.errorMessage = this.$t('codeError');
        return;
      }

      try {
        const success = await this.register({
          nom: this.nom,
          prenom: this.prenom,
          email: this.email,
          identifiant: this.identifiant,
          motDePasse: this.motDePasse,
          role: this.role,
        });

        if (success) {
          const redirectPath = this.$store.state.user.redirectPath || '/MonCompte';
          await this.$store.dispatch('user/clearRedirectPath');
          this.$router.push(redirectPath);
        }
      } catch (error) {
        this.errorMessage = this.$t('registerError');
        console.error(error);
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
  background: url("../assets/images/backgroundconnexion.jpg") no-repeat;
  background-position: center;
  background-size: cover;
}

.form-box {
  position: relative;
  width: 400px;
  min-height: 500px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(15px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  margin-top: 125px;
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
  color: #ffffff;
  font-size: 1em;
  pointer-events: none;
  transition: 0.3s;
}

.inputbox input:focus~label,
.inputbox input:valid~label {
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
  color: #fff;
}

.inputbox input:focus,
.inputbox select:focus {
  border-bottom: 2px solid #fff;
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
  margin-top: 20px;
  margin-bottom: 20px;
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

select>option {
  color: #000;
}

.inputbox>option {
  color: black;
}
</style>
