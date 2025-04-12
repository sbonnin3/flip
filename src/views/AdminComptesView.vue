<template>
  <div class="admin-comptes-container">
    <h1>Gestion des Comptes</h1>

    <div class="search-container">
      <input v-model="searchQuery" type="text" placeholder="Rechercher dans les identifiants..." class="search-bar" />
    </div>

    <div class="role-filters">
      <label v-for="role in uniqueRoles" :key="role">
        <input type="checkbox" :value="role" v-model="selectedRoles" />
        {{ role }}
      </label>
      <button @click="resetFilters" class="reset-button">Réinitialiser</button>
    </div>

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
            <button v-if="compte.role.toLowerCase() !== 'administrateur'" @click="deleteCompte(compte.id)">
              Supprimer
            </button>
            <button @click="openEditModal(compte)">Modifier</button>
          </td>
        </tr>
      </tbody>
    </table>

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
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <div class="modal-actions">
          <button @click="saveEditCompte" style="color: black">Enregistrer</button>
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
      searchQuery: "",
      currentSort: "identifiant",
      sortAsc: true,
      selectedRoles: [],
      isEditModalOpen: false,
      editedCompte: null,
      errorMessage: "",
      isDeleting: false,
    deleteError: null
    };
  },
  computed: {
    comptes() {
      return this.$store.state.user.comptes;
    },
    uniqueRoles() {
      return [...new Set(this.comptes.map((compte) => compte.role))];
    },
    filteredAndSortedComptes() {
      let filteredComptes = this.comptes.filter((compte) => {
        const matchesSearch = this.searchQuery
          ? compte.identifiant.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true;

        const matchesRole =
          this.selectedRoles.length === 0 || this.selectedRoles.includes(compte.role);

        return matchesSearch && matchesRole;
      });

      return filteredComptes.sort((a, b) => {
        let modifier = this.sortAsc ? 1 : -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    },
  },
  created() {
  this.$store.dispatch('user/initComptes');
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
async deleteCompte(id) {
    this.isDeleting = true;
    this.deleteError = null;
    
    try {
      await this.$store.dispatch('user/deleteCompte', id);
      await this.$store.dispatch('user/initComptes')
      // ... reste du code
    } catch (error) {
      this.deleteError = error.message;
    } finally {
      this.isDeleting = false;
    }
  },
    openEditModal(compte) {
      this.editedCompte = { ...compte };
      this.errorMessage = "";
      this.isEditModalOpen = true;
    },
    closeEditModal() {
      this.editedCompte = null;
      this.errorMessage = "";
      this.isEditModalOpen = false;
    },
    saveEditCompte() {
  const duplicate = this.comptes.some(
    (compte) =>
      compte.identifiant === this.editedCompte.identifiant &&
      compte.id !== this.editedCompte.id
  );

  if (duplicate) {
    this.errorMessage = "Cet identifiant existe déjà. Veuillez en choisir un autre.";
    return;
  }

  // Utilisez l'action du module user
  this.$store.dispatch('user/updateCompte', this.editedCompte)
    .then(() => {
      this.closeEditModal();
    })
    .catch(error => {
      this.errorMessage = "Erreur lors de la mise à jour";
      console.error(error);
    });
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
  --primary-color: #4361ee;
  --primary-hover: #3a56d4;
  --secondary-color: #f8f9fa;
  --secondary-hover: #e9ecef;
  --danger-color: #ef233c;
  --danger-hover: #d90429;
  --success-color: #2b9348;
  --success-hover: #008000;
  --warning-color: #ffaa00;
  --text-dark: #212529;
  --text-medium: #495057;
  --text-light: #6c757d;
  --border-color: #dee2e6;
  --bg-light: #f8f9fa;
  --bg-dark: #343a40;
  --modal-overlay: rgba(0, 0, 0, 0.5);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

.admin-comptes-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

h1 {
  color: var(--text-dark);
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-align: center;
}

.search-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-bar {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.search-bar:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
}

.role-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--bg-light);
  border-radius: var(--radius-md);
}

.role-filters label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-medium);
  font-size: 0.9rem;
}

.reset-button {
  padding: 0.5rem 1rem;
  background-color: var(--text-light);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
  margin-left: auto;
}

.reset-button:hover {
  background-color: var(--text-medium);
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 1.5rem 0;
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-md);
  overflow: hidden;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background-color: var(--primary-color);
  color: white;
  font-weight: 500;
  position: sticky;
  top: 0;
  cursor: pointer;
  transition: var(--transition);
}

th:hover {
  background-color: var(--primary-hover);
}

th span {
  margin-left: 0.5rem;
  font-size: 0.8rem;
}

td {
  color: var(--text-medium);
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background-color: var(--secondary-color);
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

button:last-child {
  margin-right: 0;
}

button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Role-specific row colors */
.role-administrateur {
  background-color: rgba(239, 35, 60, 0.1);
}

.role-restaurateur {
  background-color: rgba(43, 147, 72, 0.1);
}

.role-vendeur {
  background-color: rgba(0, 119, 182, 0.1);
}

.role-createur {
  background-color: rgba(255, 170, 0, 0.1);
}

.role-organisateur {
  background-color: rgba(156, 36, 113, 0.1);
}

.role-utilisateur {
  background-color: rgba(108, 117, 125, 0.05);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--modal-overlay);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal h2 {
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.modal label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-medium);
  font-size: 0.9rem;
}

.modal input,
.modal select {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: var(--transition);
}

.modal input:focus,
.modal select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-actions button {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
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
  color: var(--text-medium);
}

.modal-actions button:last-child:hover {
  background-color: var(--secondary-hover);
}

.error-message {
  color: var(--danger-color);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
}

/* Button variants */
button.delete-button {
  background-color: var(--danger-color);
  color: white;
}

button.delete-button:hover {
  background-color: var(--danger-hover);
}

button.edit-button {
  background-color: var(--warning-color);
  color: white;
}

button.edit-button:hover {
  background-color: #e69500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .admin-comptes-container {
    padding: 1rem;
  }

  table {
    display: block;
    overflow-x: auto;
  }

  .role-filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .reset-button {
    margin-left: 0;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal {
    padding: 1.5rem;
    margin: 0 1rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }
}

/* Loading state */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 3px solid var(--primary-color);
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
</style>
