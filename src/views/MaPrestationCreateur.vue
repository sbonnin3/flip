<template>
  <div class="prestation-createur">
    <h1>Gestion de la prestation pour Créateur</h1>

    <form @submit.prevent="saveStand">
      <!-- Nom du stand -->
      <div class="form-group">
        <label for="nom">Nom du Stand :</label>
        <input type="text" v-model="stand.nom" id="nom" required />
      </div>

      <!-- Image du stand -->
      <div class="form-group">
        <label for="image">Image du Stand :</label>
        <input type="file" @change="handleImageUpload" id="image" />
        <div v-if="stand.image">
          <img :src="stand.image" alt="Image du stand" class="stand-image" />
        </div>
      </div>

      <!-- Point associé sur la carte (stands disponibles uniquement) -->
      <div class="form-group">
        <label for="point">Point sur la carte :</label>
        <select v-model="stand.idPoint" id="point" required>
          <option v-for="point in availablePoints" :key="point.idPoint" :value="point.idPoint">
            Point {{ point.idPoint }}
          </option>
        </select>
      </div>

      <!-- Bouton d'enregistrement -->
      <button type="submit" class="save-button">{{ isNewStand ? 'Créer le stand' : 'Enregistrer les modifications' }}</button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { points, stands } from "@/datasource/data.js";

export default {
  name: "MaPrestationCreateur",
  data() {
    return {
      stand: {
        id: null,
        nom: "",
        type: "",
        image: "",
        idPoint: null,
        comptes: [],
      },
      isNewStand: true,
      originalPointId: null,
    };
  },
  computed: {
    ...mapGetters(["userSession"]),
    availablePoints() {
      return points.filter(point => point.category === "Emplacement" && point.disponible);
    }
  },
  created() {
    this.initializeStand();
  },
  methods: {
    initializeStand() {
      // Charger les informations à partir du localStorage si elles existent
      const savedStand = JSON.parse(localStorage.getItem(`stand_${this.userSession.id}`));
      if (savedStand) {
        this.stand = { ...savedStand };
        this.isNewStand = false;
        this.originalPointId = this.stand.idPoint;
        return;
      }

      // Sinon, initialiser avec les données par défaut
      const roleToTypeMap = {
        createur: "stand",
        restaurateur: "restaurant",
        vendeur: "boutique",
        organisateur: "tournoi"
      };
      this.stand.type = roleToTypeMap[this.userSession.role] || "autre";

      const existingStand = stands.find(stand => stand.comptes.includes(this.userSession.id));
      if (existingStand) {
        this.stand = { ...existingStand };
        this.isNewStand = false;
        this.originalPointId = this.stand.idPoint;
      } else {
        this.stand.comptes = [this.userSession.id];
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.stand.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    saveStand() {
      if (!this.stand.idPoint) {
        alert("Veuillez sélectionner un point sur la carte.");
        return;
      }

      // Libérer l'ancien point si nécessaire
      if (this.originalPointId && this.originalPointId !== this.stand.idPoint) {
        this.updatePointAvailability(this.originalPointId, true);
      }

      // Marquer le point comme occupé
      this.updatePointAvailability(this.stand.idPoint, false);

      if (this.isNewStand) {
        this.stand.id = stands.length + 1;
        stands.push({ ...this.stand });
        alert("Stand créé avec succès !");
      } else {
        const index = stands.findIndex(stand => stand.id === this.stand.id);
        if (index !== -1) {
          stands[index] = { ...this.stand };
          alert("Modifications enregistrées avec succès !");
        }
      }

      // Sauvegarder dans le localStorage
      this.saveStandToLocalStorage();

      // Mettre à jour l'état
      this.isNewStand = false;
      this.originalPointId = this.stand.idPoint;
    },
    saveStandToLocalStorage() {
      localStorage.setItem(`stand_${this.userSession.id}`, JSON.stringify(this.stand));
    },
    updatePointAvailability(pointId, isAvailable) {
      const point = points.find(p => p.idPoint === pointId);
      if (point) {
        point.disponible = isAvailable;
      }
    }
  },
  beforeDestroy() {
    // Libérer le point si l'utilisateur quitte sans sauvegarder
    if (this.isNewStand && this.stand.idPoint) {
      this.updatePointAvailability(this.stand.idPoint, true);
    }
  }
};
</script>

<style scoped>
.prestation-createur {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.stand-image {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  border-radius: 10px;
}

.save-button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #0056b3;
}
</style>
