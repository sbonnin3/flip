<template>
    <div class="admin-comptes-container">
      <h1>Gestion des Comptes</h1>
      <table>
        <thead>
          <tr>
            <th>Nom d'utilisateur</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="compte in comptes" :key="compte.id">
            <td>{{ compte.identifiant }}</td>
            <td>{{ compte.email }}</td>
            <td>{{ compte.role }}</td>
            <td>
              <button @click="deleteCompte(compte.id)">Supprimer</button>
              <button @click="editCompte(compte)">Modifier</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: "AdminComptesView",
    computed: {
      comptes() {
        return this.$store.state.comptes;
      }
    },
    methods: {
      deleteCompte(id) {
        this.$store.commit('REMOVE_COMPTE', id);
      },
      editCompte(compte) {
        console.log("Modifier le compte :", compte);
      }
    }
  };
  </script>
  
  <style scoped>
  .admin-comptes-container {
    margin-top: 80px;
    padding: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f4f4f4;
  }
  </style>
  