<template>
  <div class="pagecompte">
    <div class="mon-compte-page">
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
.pagecompte {
  padding-top: 80px;
}

.mon-compte-page {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  background-color: #f04e23;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #d83d1a;
}
</style>