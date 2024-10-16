<template>
    <div class="mes-commandes">
      <h1>Mes Commandes</h1>
      <p>Vous trouverez ici toutes vos commandes passées et en cours.</p>
      <ul>
        <li v-for="(commande, index) in commandes" :key="index">
          Commande #{{ commande.id }} - Statut : {{ commande.status }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "PageMesCommandes",
    data() {
      return {
        commandes: [
          { id: 1, status: "Livré" },
          { id: 2, status: "En cours de préparation" },
          { id: 3, status: "Expédié" },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .mes-commandes {
    padding: 20px;
  }
  </style>
  