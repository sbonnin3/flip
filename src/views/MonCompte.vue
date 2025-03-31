<template>
  <div class="pagecompte">
    <div class="mon-compte-page form-box">
      <h2>Mon Compte</h2>
      <div v-if="user" class="user-details">  <!-- Changé userSession en user -->
        <p><strong>Nom :</strong> {{ user.nom }}</p>
        <p><strong>Prénom :</strong> {{ user.prenom }}</p>
        <p><strong>Email :</strong> {{ user.email }}</p>
        <p><strong>Téléphone :</strong> {{ user.telephone || 'Non renseigné' }}</p>
        <p><strong>Rôle :</strong> {{ user.role }}</p>
        <button @click="handleLogout">Se déconnecter</button>
      </div>
      <div v-else>
        <p>Chargement des données utilisateur...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "PageMonCompte",
  computed: {
    ...mapGetters('user', ['userSession']),
    user() {  // Alias pour faciliter le template
      return this.userSession;
    }
  },
  methods: {
    ...mapActions('user', ['logout']),  // Utilisez une action plutôt qu'une mutation directe
    
    async handleLogout() {
      try {
        await this.logout();
        this.$router.push('/Accueil');
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
      }
    }
  },
  mounted() {
    console.log("Données utilisateur:", this.userSession);  // Pour débogage
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  font-family: "Poppins", sans-serif;
}

.pagecompte {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: url("../assets/images/backgroundaccueil_3.jpg") no-repeat;
  background-position: center;
  background-size: cover;
}

.mon-compte-page {
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
  color: white;
}

h2 {
  font-size: 2em;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
}

.user-details p {
  margin: 10px 0;
  font-size: 1em;
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

div p {
  font-size: 1em;
  color: white;
}
</style>
