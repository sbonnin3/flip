<template>
  <div class="admin-comptes-container">
    <h1>Gestion des Comptes</h1>

    <!-- Barre de recherche -->
    <div class="search-container">
      <input v-model="searchQuery" type="text" placeholder="Rechercher dans les identifiants..." class="search-bar" />
    </div>

    <!-- Filtres par rôle avec bouton Reset -->
    <div class="role-filters">
      <label v-for="role in uniqueRoles" :key="role">
        <input type="checkbox" :value="role" v-model="selectedRoles" />
        {{ role }}
      </label>
      <button @click="resetFilters" class="reset-button">Réinitialiser</button>
    </div>

    <!-- Tableau -->
    <table>
      <thead>
        <tr>
          <th @click="sortBy('identifiant')">
            Nom d'utilisateur
            <span>{{ currentSort === 'identifiant' ? (sortAsc ? '↑' : '↓') : '' }}</span>
          </th>
          <th @click="sortBy('email')">
            Email
            <span>{{ currentSort === 'email' ? (sortAsc ? '↑' : '↓') : '' }}</span>
          </th>
          <th @click="sortBy('role')">
            Rôle
            <span>{{ currentSort === 'role' ? (sortAsc ? '↑' : '↓') : '' }}</span>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="compte in filteredAndSortedComptes" :key="compte.id" :class="getRoleClass(compte.role)">
          <td>{{ compte.identifiant }}</td>
          <td>{{ compte.email }}</td>
          <td>{{ compte.role }}</td>
          <td>
            <button v-if="compte.role !== 'administrateur'" @click="deleteCompte(compte.id)">
              Supprimer
            </button>
            <button @click="openEditModal(compte)">Modifier</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modale pour la modification -->
    <div v-if="isEditModalOpen" class="modal-overlay">
      <div class="modal">
        <h2>Modifier le compte</h2>
        <label>
          Identifiant :
          <input v-model="editedCompte.identifiant" type="text" />
        </label>
        <label>
          Email :
          <input v-model="editedCompte.email" type="email" />
        </label>
        <label>
          Rôle :
          <select v-model="editedCompte.role">
            <option v-for="role in uniqueRoles" :key="role" :value="role">
              {{ role }}
            </option>
          </select>
        </label>
        <!-- Message d'erreur -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <div class="modal-actions">
          <button @click="saveEditCompte">Enregistrer</button>
          <button @click="closeEditModal">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminComptesView",
  data() {
    return {
      searchQuery: "", // Texte saisi dans la barre de recherche
      currentSort: "identifiant", // Colonne actuellement triée
      sortAsc: true, // Ordre de tri (ascendant ou descendant)
      selectedRoles: [], // Rôles sélectionnés dans les filtres
      isEditModalOpen: false, // État d'ouverture de la modale
      editedCompte: null, // Compte actuellement en cours d'édition
      errorMessage: "", // Message d'erreur pour la validation
    };
  },
  computed: {
    comptes() {
      return this.$store.state.comptes;
    },
    uniqueRoles() {
      // Liste unique des rôles disponibles
      return [...new Set(this.comptes.map((compte) => compte.role))];
    },
    filteredAndSortedComptes() {
      // Filtrage combiné par recherche et rôle
      let filteredComptes = this.comptes.filter((compte) => {
        const matchesSearch = this.searchQuery
          ? compte.identifiant.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true;

        const matchesRole =
          this.selectedRoles.length === 0 || this.selectedRoles.includes(compte.role);

        return matchesSearch && matchesRole;
      });

      // Tri des résultats filtrés
      return filteredComptes.sort((a, b) => {
        let modifier = this.sortAsc ? 1 : -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    },
  },
  methods: {
    resetFilters() {
      this.searchQuery = "";
      this.selectedRoles = [];
    },
    sortBy(key) {
      if (this.currentSort === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.currentSort = key;
        this.sortAsc = true;
      }
    },
    deleteCompte(id) {
      this.$store.commit("REMOVE_COMPTE", id);
    },
    openEditModal(compte) {
      this.editedCompte = { ...compte };
      this.errorMessage = ""; // Réinitialise le message d'erreur
      this.isEditModalOpen = true;
    },
    closeEditModal() {
      this.editedCompte = null;
      this.errorMessage = ""; // Réinitialise le message d'erreur
      this.isEditModalOpen = false;
    },
    saveEditCompte() {
      // Vérifie si l'identifiant existe déjà chez un autre compte
      const duplicate = this.comptes.some(
        (compte) =>
          compte.identifiant === this.editedCompte.identifiant &&
          compte.id !== this.editedCompte.id
      );

      if (duplicate) {
        this.errorMessage = "Cet identifiant existe déjà. Veuillez en choisir un autre.";
        return;
      }

      // Sauvegarde le compte si aucune erreur
      this.$store.commit("UPDATE_COMPTE", this.editedCompte);
      this.closeEditModal();
    },
    getRoleClass(role) {
      const roleClasses = {
        administrateur: "role-administrateur",
        restaurateur: "role-restaurateur",
        vendeur: "role-vendeur",
        createur: "role-createur",
        organisateur: "role-organisateur",
        utilisateur: "role-utilisateur",
      };
      return roleClasses[role] || "";
    },
  },
};
</script>

<style scoped>
:root {
  --primary-color: #007bff;
  --primary-hover: #0056b3;
  --secondary-color: #e0e0e0;
  --secondary-hover: #cccccc;
  --error-color: red;
  --font-color-dark: #333;
  --font-color-light: #555;
  --border-color: #ddd;
  --modal-bg: rgba(0, 0, 0, 0.7); /* Fond sombre pour popup */
  --box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); /* Ombre flottante */
}

.admin-comptes-container {
  margin-top: 80px;
  padding: 20px;
}

.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.search-bar {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.search-button,
.reset-button {
  padding: 8px 12px;
  border: none;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover,
.reset-button:hover {
  background-color: var(--primary-hover);
}

.role-filters {
  margin-bottom: 10px;
}

.role-filters label {
  margin-right: 10px;
  font-size: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid var(--border-color);
  padding: 8px;
  text-align: left;
}

th span {
  margin-left: 5px;
  font-size: 12px;
}

th:hover {
  background-color: #f4f4f4;
}

.role-administrateur {
  background-color: #ffcccc; /* Rouge clair */
}

.role-restaurateur {
  background-color: #ccffcc; /* Vert clair */
}

.role-vendeur {
  background-color: #ccccff; /* Bleu clair */
}

.role-createur {
  background-color: #ffffcc; /* Jaune clair */
}

.role-organisateur {
  background-color: #ffccff; /* Rose clair */
}

.role-utilisateur {
  background-color: #e6e6e6; /* Gris clair */
}

.error-message {
  color: var(--error-color);
  margin-top: 10px;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--modal-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #777777;
  border-radius: 12px;
  box-shadow: var(--box-shadow);
  padding: 30px;
  max-width: 450px;
  width: 90%;
  text-align: left;
  font-family: Arial, sans-serif;
  position: relative;
}

.modal h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: bold;
  color: var(--font-color-dark);
  text-align: center;
}

.modal label {
  display: block;
  margin-bottom: 10px;
  font-size: 16px;
  color: var(--font-color-light);
}

.modal input,
.modal select {
  width: 100%;
  padding: 10px;
  font-size: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 20px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.modal input:focus,
.modal select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.modal-actions button {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-actions button:first-child {
  background-color: var(--primary-color);
  color: white;
}

.modal-actions button:first-child:hover {
  background-color: var(--primary-hover);
}

.modal-actions button:last-child {
  background-color: var(--secondary-color);
  color: var(--font-color-dark);
}

.modal-actions button:last-child:hover {
  background-color: var(--secondary-hover);
}

@media (max-width: 600px) {
  .modal {
    padding: 20px;
  }

  .modal h2 {
    font-size: 20px;
  }

  .modal input,
  .modal select {
    font-size: 14px;
  }

  .modal-actions button {
    font-size: 14px;
  }
}
</style>
