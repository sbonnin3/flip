<template>
  <div class="pagecompte">
    <div class="mon-compte-page form-box">
      <h2>Mon Compte</h2>
      <div v-if="userSession" class="user-details">
        <p><strong>Nom :</strong> {{ userSession.nom }}</p>
        <p><strong>Prénom :</strong> {{ userSession.prenom }}</p>
        <p><strong>Email :</strong> {{ userSession.email }}</p>
        <p><strong>Téléphone :</strong> {{ userSession.telephone }}</p>
        <p><strong>Rôle :</strong> {{ userSession.role }}</p>
        <button @click="handleLogout">Se déconnecter</button>
      </div>
      <div v-else>
        <p>Aucun utilisateur connecté.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: "PageMonCompte",
  computed: {
    ...mapState(['userSession']),
  },
  methods: {
    ...mapMutations(['CLEAR_USER_SESSION']),
    handleLogout() {
      this.CLEAR_USER_SESSION();
      alert('Vous êtes déconnecté.');
      this.$router.push('/Accueil');
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
