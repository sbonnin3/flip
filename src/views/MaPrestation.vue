<template>
  <div class="prestation-createur">
    <h1>Gestion de la prestation pour Créateur</h1>

    <form @submit.prevent="saveStand">
      <!-- Nom du stand -->
      <div class="form-group">
        <label for="nom">Nom du Stand :</label>
        <input type="text" v-model="stand.nom" id="nom" required />
      </div>

      <div class="form-group">
        <label for="description">Description de la prestation :</label>
        <textarea v-model="stand.description" id="description" rows="4" placeholder="Décrivez votre prestation..."
          required></textarea>
      </div>

      <!-- Image du stand -->
      <div class="form-group">
        <label for="image">Image du Stand :</label>
        <input type="file" @change="handleImageUpload" id="image" />
        <div v-if="stand.image">
          <img :src="stand.image" alt="Image du stand" class="stand-image" />
        </div>
      </div>

      <div class="form-group map-container">
        <label>Sélectionnez un emplacement sur la carte :</label>
        <div class="map-controls">
          <select v-model="selectedLayer" @change="changeLayer">
            <option value="osm">Vue Carte</option>
            <option value="satellite">Vue Satellite</option>
          </select>
        </div>

        <l-map :zoom="zoom" :center="center" :max-bounds="bounds" :min-zoom="minZoom" :max-zoom="maxZoom"
          :options="mapOptions" style="height: 500px;" @ready="mapReady">
          <l-tile-layer :url="layers[selectedLayer].url"
            :attribution="layers[selectedLayer].attribution"></l-tile-layer>

          <l-marker v-for="point in availablePoints" :key="point.idPoint" :lat-lng="point.coordinates"
            :icon="getIconForPoint(point)" @click="selectPoint(point)">
            <l-tooltip>
              {{ point === selectedPoint ? 'Point sélectionné' : 'Disponible - Cliquez pour sélectionner' }}
            </l-tooltip>
          </l-marker>
        </l-map>

        <p v-if="selectedPoint" class="selected-point-info">
          Point sélectionné : {{ selectedPoint.idPoint }}
        </p>
        <p v-else class="no-selection-info">
          Veuillez sélectionner un point sur la carte
        </p>
      </div>

      <!-- Bouton d'enregistrement -->
      <button type="submit" class="save-button">{{ isNewStand ? 'Créer le stand' : 'Enregistrer les modifications'
        }}</button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { points, stands } from "@/datasource/data.js";
import { LMap, LTileLayer, LMarker, LTooltip } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import emplacementIcon from "@/assets/icons/emplacement-icon.png";
import selectedIcon from "@/assets/icons/selected-icon.png";
export default {
  name: "MaPrestationCreateur",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
  },
  data() {
    return {
      stand: {
        id: null,
        nom: "",
        type: "",
        image: "",
        description: "",
        idPoint: null,
        comptes: [],
      },
      isNewStand: true,
      originalPointId: null,
      zoom: 16,
      minZoom: 13,
      maxZoom: 18,
      center: [46.648, -0.2494],
      bounds: [[46.620, -0.270], [46.680, -0.230]],
      selectedLayer: "osm",
      mapOptions: {
        attributionControl: false
      },
      layers: {
        osm: {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: '&copy; OpenStreetMap contributors'
        },
        satellite: {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: '&copy; Esri'
        }
      }
    };
  },
  computed: {
    ...mapGetters(["userSession"]),
    availablePoints() {
      return points.filter(point =>
        point.category === "Emplacement" &&
        (point.disponible || point.idPoint === this.originalPointId)
      );
    }
  },
  created() {
    this.restorePointsState();
    this.initializeStand();
  },
  methods: {
    restorePointsState() {
      const pointsState = JSON.parse(localStorage.getItem('pointsState') || '{}');
      Object.entries(pointsState).forEach(([pointId, isAvailable]) => {
        const point = points.find(p => p.idPoint === parseInt(pointId));
        if (point) {
          point.disponible = isAvailable;
        }
      });
    },
    initializeStand() {
      const savedStand = JSON.parse(localStorage.getItem(`stand_${this.userSession.id}`));
      if (savedStand) {
        this.stand = { ...savedStand };
        this.isNewStand = false;
        this.originalPointId = this.stand.idPoint;
        this.selectedPoint = points.find(p => p.idPoint === this.stand.idPoint);
        this.updatePointAvailability(this.stand.idPoint, false);
        return;
      }

      const roleToTypeMap = {
        createur: "stand",
        restaurateur: "restaurant",
        vendeur: "boutique",
        organisateur: "tournois"
      };
      this.stand.type = roleToTypeMap[this.userSession.role] || "autre";

      const existingStand = stands.find(stand => stand.comptes.includes(this.userSession.id));
      if (existingStand) {
        this.stand = { ...existingStand };
        this.isNewStand = false;
        this.originalPointId = this.stand.idPoint;
        this.selectedPoint = points.find(p => p.idPoint === this.stand.idPoint);
        this.updatePointAvailability(this.stand.idPoint, false);
      } else {
        this.stand.comptes = [this.userSession.id];
      }
    },
    getIconForPoint(point) {
      const iconConfig = point.idPoint === this.selectedPoint?.idPoint ?
        {
          iconUrl: selectedIcon,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        } : {
          iconUrl: emplacementIcon,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        };

      return L.icon(iconConfig);
    },
    selectPoint(point) {
      this.selectedPoint = point;
      this.stand.idPoint = point.idPoint;
      this.$forceUpdate();
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
    saveStandToLocalStorage() {
      localStorage.setItem(`stand_${this.userSession.id}`, JSON.stringify(this.stand));
    },
    changeLayer() {
    },
    mapReady() {
      if (this.selectedPoint) {
        this.$nextTick(() => {
          this.center = this.selectedPoint.coordinates;
        });
      }
    },
    saveStand() {
      if (!this.stand.idPoint) {
        alert("Veuillez sélectionner un point sur la carte.");
        return;
      }

      if (this.originalPointId && this.originalPointId !== this.stand.idPoint) {
        this.updatePointAvailability(this.originalPointId, true);
      }

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

      this.saveStandToLocalStorage();

      this.isNewStand = false;
      this.originalPointId = this.stand.idPoint;
    },
    updatePointAvailability(pointId, isAvailable) {
      const point = points.find(p => p.idPoint === pointId);
      if (point) {
        point.disponible = isAvailable;
        const pointsState = JSON.parse(localStorage.getItem('pointsState') || '{}');
        pointsState[pointId] = isAvailable;
        localStorage.setItem('pointsState', JSON.stringify(pointsState));
      }
    }
  },
  beforeDestroy() {
    if (this.isNewStand && this.stand.idPoint && !localStorage.getItem(`stand_${this.userSession.id}`)) {
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

.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: vertical;
}
</style>