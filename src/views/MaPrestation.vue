<template>
  <div class="page-prestation">
    <h1 class="page-title">Gestion de la prestation</h1>


    <div class="tab-container">
      <button :class="{ active: selectedTab === 'Catalogue' }"
              @click="selectTab('Catalogue')">Catalogue</button>
      <button :class="{ active: selectedTab === 'Jeux' }"
              @click="selectTab('Jeux')">Mes jeux </button>
      <button :class="{ active: selectedTab === 'Emplacement' }"
              @click="selectTab('Emplacement')">Mon emplacement</button>
    </div>

    <!-- Onglet des jeux du flip -->

    <div v-show="selectedTab === 'Catalogue'">
      <div class="cards-container" v-if="jeux.length">
        <div v-for="jeu in jeux" :key="jeu.name" class="card" @click="openJeuModal(jeu)">
          <img :src="jeu.image" alt="Image du jeu" class="card-image"/>
          <div class="card-content">
            <h2 class="card-title">{{ jeu.name }}</h2>
            <p class="card-type">Type : {{ jeu.type }}</p>
            <p class="card-players">Nombre de joueurs : {{ jeu.nombre_de_joueurs.join(', ') }}</p>
            <p class="card-age">Âge minimum : {{ jeu.age_minimum }} ans</p>
            <p class="card-duration">Durée : {{ jeu.duree }} min</p>
            <p class="card-stand">Nom du stand : {{ jeu.nom_stand }}</p>
          </div>
        </div>
        <div v-if="selectedJeu" class="modal">
          <div class="modal-content">
            <span class="close-button" @click="closeJeuModal">&times;</span>
            <h2>{{ selectedJeu.name }}</h2>
            <img :src="selectedJeu.image" alt="Image du jeu" class="modal-image"/>
            <p><strong>Type :</strong> {{ selectedJeu.type }}</p>
            <p><strong>Nombre de joueurs :</strong> {{ selectedJeu.nombre_de_joueurs.join(', ') }}</p>
            <p><strong>Âge minimum :</strong> {{ selectedJeu.age_minimum }} ans</p>
            <p><strong>Durée :</strong> {{ selectedJeu.duree }} minutes</p>
            <p><strong>Éditeur :</strong> {{ selectedJeu.editeur }}</p>
            <p><strong>Nom du stand :</strong> {{ selectedJeu.nom_stand }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-show="selectedTab === 'Jeux'">
      <div class="cards-container" v-if="jeuxCreation.length">
        <div v-for="jeu in jeuxCreation" :key="jeu.name" class="card" @click="openJeuModal(jeu)">
          <img :src="jeu.image" alt="Image du jeu" class="card-image"/>
          <div class="card-content">
            <h2 class="card-title">{{ jeu.name }}</h2>
            <p class="card-type">Type : {{ jeu.type }}</p>
            <p class="card-players">Nombre de joueurs : {{ jeu.nombre_de_joueurs.join(', ') }}</p>
            <p class="card-age">Âge minimum : {{ jeu.age_minimum }} ans</p>
            <p class="card-duration">Durée : {{ jeu.duree }} min</p>
            <p class="card-stand">Nom du stand : {{ jeu.nom_stand }}</p>
          </div>
        </div>
      </div>
      <p v-else> Vous n'avez aucun jeux.</p>
      <button class="create-button" @click="openCreationConfirmation">Créer un jeu</button>

      <div v-if="showConfirmation" class="confirmation-modal">
        <div class="modal-content">
          <span class="close-button" @click="closeConfirmation">&times;</span>
          <h2>Création du jeu </h2>

          <div class="inputBox">
            <label for="name">Nom du jeu :</label>
            <input v-model="gameDetails.name" type="text" id="name" />
          </div>
          <div class="inputBox">
            <label for="type">Type du jeu :</label>
            <input v-model="gameDetails.type" type="text" id="type" />
          </div>
          <div class="inputBox">
            <label for="playerNumber">Nombre de joueurs :</label>
            <input v-model="gameDetails.nombre_de_joueurs" type="text" id="playerNumber" />
          </div>
          <div class="inputBox">
            <label for="minimumAge">Âge minimum :</label>
            <input v-model="gameDetails.age_minimum" type="text" id="minimumAge" />
          </div>
          <div class="inputBox">
            <label for="duration">Durée (minutes) :</label>
            <input v-model="gameDetails.duree" type="text" id="duration" />
          </div>
          <!--div class="inputBox">
            <label for="standName">Nom du stand :</label>
            <input v-model="gameDetails.nom_stand" type="text" id="standName" />
          </div-->
          <div class="imageBox">
            <label for="imageGame">Image du jeu :</label>
            <input type="file" id="imageGame" />
          </div>
          <button @click="confirmCreation" class="confirm-button">Confirmer</button>
          <button @click="closeConfirmation" class="cancel-button">Annuler</button>
        </div>
      </div>

    </div>

    <!-- Onglet pour sélectionner l'emplacement du stand -->
    <div v-show="selectedTab === 'Emplacement'">
      <div class="prestation-emplacement">
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

            <l-map
                :zoom="zoom"
                :center="center"
                :max-bounds="bounds"
                :min-zoom="minZoom"
                :max-zoom="maxZoom"
                :options="mapOptions"
                style="height: 500px;"
                @ready="mapReady"
            >
              <l-tile-layer
                  :url="layers[selectedLayer].url"
                  :attribution="layers[selectedLayer].attribution"
              ></l-tile-layer>

              <l-marker
                  v-for="point in availablePoints"
                  :key="point.idPoint"
                  :lat-lng="point.coordinates"
                  :icon="getIconForPoint(point)"
                  @click="selectPoint(point)"
              >
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { points, stands, jeux, jeuxCreation } from "@/datasource/data.js";
import { LMap, LTileLayer, LMarker, LTooltip } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import emplacementIcon from "@/assets/icons/emplacement-icon.png";
import selectedIcon from "@/assets/icons/selected-icon.png";
export default {
  name: "PageMaPrestation",
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
      selectedTab: "Catalogue",
      selectedJeu: null,
      showConfirmation: false,
      gameDetails: {
        _id: null,
        type: '',
        name: '',
        image: null,
        nombre_de_joueurs: [],
        age_minimum: null,
        duree: null,
        nom_stand: '',
        prix: '',
      },
      jeux,
      jeuxCreation,
      isNewStand: true,
      selectedPoint: null,
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
    selectTab(tab) {
      this.selectedTab = tab;
    },
    openJeuModal(jeu) {
      this.selectedJeu = jeu;
    },
    closeJeuModal() {
      this.selectedJeu = null;
    },
    openCreationConfirmation() {
      this.showConfirmation = true;
    },
    closeConfirmation() {
      this.showConfirmation = false;
    },
    confirmCreation(){

    },
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
    mapReady(mapInstance) {
      this.map = mapInstance;
      if (this.selectedPoint) {
        this.center = this.selectedPoint.coordinates;
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
  watch: {
    selectedTab(newVal) {
      if (newVal === "Emplacement") {
        this.$nextTick(() => {
          if (this.map) this.map.invalidateSize();
        });
      }
    },
  },
  beforeDestroy() {
    if (this.isNewStand && this.stand.idPoint && !localStorage.getItem(`stand_${this.userSession.id}`)) {
      this.updatePointAvailability(this.stand.idPoint, true);
    }
  }
};
</script>

<style scoped>
.page-prestation {
  padding-top: 100px;
  text-align: center;
}

.page-title {
  font-size: 2em;
  margin-bottom: 20px;
}

.prestation-emplacement {
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

.tab-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-container button {
  padding: 10px 20px;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  background: none;
  font-size: 1em;
  margin: 0 10px;
  transition: color 0.3s ease, border-bottom-color 0.3s ease;
}

.tab-container button:hover,
.tab-container button.active {
  color: #d22328;
  border-bottom-color: #d22328;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.05);
  background-color: #fce012;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 15px;
}

.card-title {
  font-size: 1.5em;
  margin: 10px 0;
}

.card-type,
.card-players,
.card-age,
.card-duration,
.card-stand {
  font-size: 1em;
  color: #555;
  margin: 5px 0;
}

.modal,
.reservation-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin-bottom: 20px;
}

.create-button {
  background-color: #f04e23;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-button:hover {
  background-color: #d83d1a;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
}

.inputBox {
  margin-bottom: 15px;
}

.inputBox label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.inputBox input {
  width: 95%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.inputBox input:focus {
  border-color: #d83d1a;
  outline: none;
}

.imageBox {
  margin-bottom: 15px;
}

.imageBox label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.imageBox input {
  display: block;
  width: 95%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

/*button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}*/

.modal-content {
  background-color: #fff;
  margin-top: 10px;
  padding: 20px;
  border-radius: 10px;
  width: 30%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: left;
  position: relative;
  overflow-y: auto;
  max-height: 70vh;
}

.modal-content h2 {
  text-align: center;
}

.confirmation-modal,
.reservation-message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirmation-modal .modal-content,
.reservation-message .modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

}

.confirm-button,
.cancel-button {
  background-color: #f04e23;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.confirm-button:hover {
  background-color: #d83d1a;
}
</style>