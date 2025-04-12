<template>
  <div class="page-carte">
    <div class="map-container">
      <h1 class="page-title">Carte de Parthenay</h1>

      <select v-model="selectedLayer" @change="changeLayer">
        <option value="osm">Vue Carte</option>
        <option value="satellite">Vue Satellite</option>
      </select>

      <div class="filter-section">
        <h3>Filtres de catégories :</h3>
        <label v-for="category in categories" :key="category">
          <input type="checkbox" :value="category" v-model="selectedCategories"
                 @change="syncEmplacementStatus(category)" />
          {{ category }}
        </label>
      </div>

      <div class="filter-section">
        <h3>Filtres d'emplacements :</h3>
        <label>
          <input type="checkbox" value="available" v-model="emplacementStatus" @change="syncCategoryCheckbox" />
          Emplacements libres
        </label>
        <label>
          <input type="checkbox" value="occupied" v-model="emplacementStatus" @change="syncCategoryCheckbox" />
          Emplacements occupés
        </label>
      </div>

      <l-map :zoom="zoom" :center="center" :max-bounds="bounds" :max-bounds-viscosity="1.0" :min-zoom="minZoom"
             :max-zoom="maxZoom" style="height: 700px; width: 100%;">
        <l-tile-layer :url="layers[selectedLayer].url" :attribution="layers[selectedLayer].attribution"></l-tile-layer>

        <l-marker v-for="(point, index) in filteredPoints" :key="`${index}-${point.id}`"
                  :lat-lng="[point.coordonnees_y, point.coordonnees_x]"
                  :icon="getIconForPoint(point)">
          <l-popup>{{ getPopupText(point) }}</l-popup>
          <l-tooltip>{{ getTooltipText(point) }}</l-tooltip>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { mapActions, mapState } from "vuex";

// Import des icônes
import toiletIcon from "@/assets/icons/toilet-icon.png";
import parkingIcon from "@/assets/icons/parking-icon.png";
import tournamentIcon from "@/assets/icons/tournament-icon.png";
import restaurationIcon from "@/assets/icons/restauration-icon.png";
import boutiqueIcon from "@/assets/icons/boutique-icon.png";
import standIcon from "@/assets/icons/stand-icon.png";
import emplacementIcon from "@/assets/icons/emplacement-icon.png";

export default {
  name: "PageCarte",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
  },
  data() {
    return {
      zoom: 16,
      minZoom: 13,
      maxZoom: 18,
      center: [46.648, -0.2494],
      bounds: [[46.620, -0.270], [46.680, -0.230]],
      selectedLayer: "osm",
      selectedCategories: [],
      emplacementStatus: ["available", "occupied"],
      loading: true,
      layers: {
        osm: {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
        satellite: {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: '&copy; <a href="https://www.esri.com/en-us/home">Esri</a> &mdash; Source: Esri, USGS, NOAA',
        },
      },
      icons: {
        Toilettes: L.icon({
          iconUrl: toiletIcon,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        }),
        Parking: L.icon({
          iconUrl: parkingIcon,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        }),
        Tournois: L.icon({
          iconUrl: tournamentIcon,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        }),
        Restauration: L.icon({
          iconUrl: restaurationIcon,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        }),
        Boutique: L.icon({
          iconUrl: boutiqueIcon,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        }),
        Stand: L.icon({
          iconUrl: standIcon,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        }),
        Emplacement: L.icon({
          iconUrl: emplacementIcon,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        }),
      },
    };
  },
  computed: {
    ...mapState("points", ["points"]),
    ...mapState("stands", ["stands", "typeStands"]),
    ...mapState("user", ["comptes"]),

    categories() {
      return [...new Set(this.points.map(point => point.categorie))];
    },

    filteredPoints() {
      return this.points.filter(point => {
        if (!point.coordonnees_x || !point.coordonnees_y ||
            isNaN(point.coordonnees_x) || isNaN(point.coordonnees_y)) {
          return false;
        }

        const categoryMatch = this.selectedCategories.length === 0 ||
            this.selectedCategories.includes(point.categorie);

        let statusMatch = true;
        if (point.categorie === 'Emplacement') {
          const isOccupied = point.reserve; // Utilisation directe du booléen reserve

          if (this.emplacementStatus.includes("available") && !isOccupied) {
            statusMatch = true;
          } else if (this.emplacementStatus.includes("occupied") && isOccupied) {
            statusMatch = true;
          } else {
            statusMatch = false;
          }
        }

        return categoryMatch && statusMatch;
      });
    },
  },
  methods: {
    ...mapActions("stands", ["getAllStands"]),

    getPopupText(point) {
      const standAssocie = this.stands?.find(stand => stand.id_emplacement === point.id);
      return standAssocie ? standAssocie.nom_stand : point.nom;
    },

    getTooltipText(point) {
      if (point.categorie === 'Emplacement') {
        return point.reserve ? "Occupé" : "Disponible"; // Basé sur reserve
      }

      const standAssocie = this.stands?.find(stand => stand.id_emplacement === point.id);
      return standAssocie ? standAssocie.nom_stand : point.nom;
    },

    getIconForPoint(point) {
      if (point.categorie !== "Emplacement") {
        return this.icons[point.categorie] || this.icons.Emplacement;
      }

      const standAssocie = this.stands?.find(stand => stand.id_emplacement === point.id);
      if (standAssocie) {
        const typeStand = this.typeStands?.find(type => type.id === standAssocie.id_type);
        if (typeStand) {
          if (typeStand.intitule.includes("Restaurant")) {
            return this.icons.Restauration;
          } else if (typeStand.intitule.includes("Activité")) {
            return this.icons.Tournois;
          } else if (typeStand.intitule.includes("Jeux")) {
            return this.icons.Stand;
          }
        }
        return this.icons.Stand;
      }
      return this.icons.Emplacement;
    },

    changeLayer() {
      // Méthode vide (à implémenter si besoin)
    },

    syncCategoryCheckbox() {
      if (this.emplacementStatus.length === 0) {
        this.selectedCategories = this.selectedCategories.filter(cat => cat !== 'Emplacement');
      } else if (!this.selectedCategories.includes('Emplacement')) {
        this.selectedCategories.push('Emplacement');
      }
    },

    syncEmplacementStatus(category) {
      if (category === 'Emplacement') {
        if (this.selectedCategories.includes('Emplacement')) {
          this.emplacementStatus = ['available', 'occupied'];
        } else {
          this.emplacementStatus = [];
        }
      }
    },
  },
  async created() {
    try {
      await this.$store.dispatch("points/getAllPoints");
      await this.$store.dispatch("stands/getAllStands");
      await this.$store.dispatch("stands/getAllTypesStand");

      // Initialiser avec toutes les catégories
      this.selectedCategories = [...this.categories];
    } catch (error) {
      console.error("Error loading map data:", error);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.page-carte {
  max-width: 100%;
}

.map-container {
  padding-top: 100px;
  max-width: 50%;
  margin: auto;
}

.leaflet-container {
  width: auto;
  border: 5px solid #000000;
  border-radius: 10px;
}

.filter-section {
  margin: 10px 0;
}

select {
  margin-bottom: 10px;
}
</style>
