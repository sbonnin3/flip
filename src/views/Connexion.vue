<template>
  <section>
    <div class="form-box">
      <div class="form-value">
        <div v-if="isLogin">
          <h2>Se connecter</h2>
          <form @submit.prevent="login">
            <div class="inputbox">
              <ion-icon name="mail-outline"></ion-icon>
              <input v-model="identifiant" type="text" required />
              <label for="identifiant">Identifiant</label>
            </div>
            <div class="inputbox">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input v-model="motDePasse" type="password" required />
              <label for="motDePasse">Mot de passe</label>
            </div>
            <div class="forget">
              <label></label>
              <label></label>
            </div>
            <button type="submit">Se connecter</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          </form>
        </div>
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
              <input v-model="email" type="email" required />
              <label for="email">Email</label>
            </div>
            <div class="inputbox">
              <ion-icon name="mail-outline"></ion-icon>
              <input v-model="identifiant" type="text" required />
              <label for="identifiant">Identifiant</label>
            </div>
            <div class="inputbox">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input v-model="motDePasse" type="password" required />
              <label for="motDePasse">Mot de passe</label>
            </div>
            <div class="inputbox">
              <select v-model="role" id="role">
                <option value="utilisateur">Utilisateur</option>
                <option value="restaurateur">Restaurateur</option>
                <option value="organisateur">Organisateur</option>
                <option value="vendeur">Vendeur</option>
                <option value="createur">Créateur</option>
              </select>
            </div>
            <div v-if="role !== 'utilisateur'" class="inputbox">
              <ion-icon name="key-outline"></ion-icon>
              <input v-model="codeInscription" type="text" required />
              <label for="codeInscription">Code d'inscription</label>
            </div>
            <button type="submit">S'inscrire</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          </form>
        </div>
        <div v-if="isLogin" class="register">
          <p>Pas de compte ? <a href="#" @click.prevent="toggleForm('signup')">S'inscrire</a></p>
        </div>
        <div v-else class="register">
          <p>Déja un compte ? <a href="#" @click.prevent="toggleForm('login')">Se connecter</a></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
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
  methods: {
    async login() {
      try {
        const success = await this.$store.dispatch('auth/login', {
          identifiant: this.identifiant,
          motDePasse: this.motDePasse
        });
        
        if (success) {
          this.$router.push("/MonCompte");
        } else {
          this.errorMessage = "Identifiant ou mot de passe incorrect";
        }
      } catch (error) {
        console.error("Erreur de connexion:", error);
        this.errorMessage = "Une erreur est survenue lors de la connexion";
      }
    },

    async register() {
      try {
        if (!this.email.includes("@")) {
          this.errorMessage = "Veuillez fournir une adresse email valide.";
          return;
        }

        if (this.role !== "utilisateur" && this.codeInscription !== "1234") {
          this.errorMessage = "Code d'inscription incorrect.";
          return;
        }

        const newAccount = {
          id: Date.now(),
          nom: this.nom,
          prenom: this.prenom,
          email: this.email,
          identifiant: this.identifiant,
          motDePasse: this.motDePasse,
          role: this.role,
          telephone: "0102030405",
          photoProfil: "https://via.placeholder.com/150",
        };

        await this.$store.dispatch('comptes/addCompte', newAccount);
        await this.$store.dispatch('auth/login', {
          identifiant: this.identifiant,
          motDePasse: this.motDePasse
        });
        
        this.$router.push("/MonCompte");
      } catch (error) {
        console.error("Erreur d'inscription:", error);
        if (error.message.includes("déjà utilisé")) {
          this.errorMessage = "Cet identifiant est déjà utilisé.";
        } else {
          this.errorMessage = "Une erreur est survenue lors de l'inscription";
        }
      }
    },

    toggleForm(formType) {
      this.isLogin = formType === 'login';
      this.errorMessage = "";
      // Réinitialisation des champs
      if (formType === 'login') {
        this.nom = "";
        this.prenom = "";
        this.email = "";
        this.role = "utilisateur";
        this.codeInscription = "";
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
