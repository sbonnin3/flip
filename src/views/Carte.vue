<template>
  <div class="page-carte">
    <div class="map-container">
      <h1 class="page-title">Carte de Parthenay</h1>

      <!-- Sélection de la vue de la carte -->
      <select v-model="selectedLayer" @change="changeLayer">
        <option value="osm">Vue Carte</option>
        <option value="satellite">Vue Satellite</option>
      </select>

      <!-- Filtre des catégories -->
      <select v-model="selectedCategory" @change="filterPoints">
        <option value="">Toutes les catégories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>

      <l-map :zoom="zoom" :center="center" :max-bounds="bounds" :max-bounds-viscosity="1.0" :min-zoom="minZoom"
        :max-zoom="maxZoom" :options="mapOptions" style="height: 700px; width: 100%;">
        <l-tile-layer :url="layers[selectedLayer].url" :attribution="layers[selectedLayer].attribution"></l-tile-layer>

        <!-- Marqueurs avec les icônes appropriées -->
        <l-marker
          v-for="(point, index) in filteredPoints"
          :key="index"
          :lat-lng="point.coordinates"
          :icon="getIconForPoint(point)"
          @mouseover="enlargeIcon(point.idPoint)"
          @mouseout="resetIcon()"
        >
          <l-popup>{{ getPopupText(point) }}</l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { points, stands } from "@/datasource/data.js";

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
  },
  data() {
    return {
      mapOptions : {
        attributionControl: false
      },
      zoom: 16,
      minZoom: 13,
      maxZoom: 18,
      center: [46.648, -0.2494],
      bounds: [[46.620, -0.270], [46.680, -0.230]],
      selectedCategory: "",
      selectedLayer: "osm",
      points,
      stands,
      hoveredPointId: null, // Nouveau pour gérer le survol
      layers: {
        osm: {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        },
        satellite: {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        },
      },
      icons: {
        Toilettes: toiletIcon,
        Parking: parkingIcon,
        Tournois: tournamentIcon,
        Restauration: restaurationIcon,
        Boutique: boutiqueIcon,
        Stand: standIcon,
        Emplacement: emplacementIcon,
      },
    };
  },
  computed: {
    filteredPoints() {
      return this.points.filter(point => {
        const categoryMatch = this.selectedCategory === "" || point.category === this.selectedCategory;
        return categoryMatch && (point.category !== 'Emplacement' || point.disponible === false);
      });
    },
    categories() {
      return [...new Set(this.points.map(point => point.category))];
    },
  },
  methods: {
    getPopupText(point) {
      const standAssocie = this.stands.find(stand => stand.idPoint === point.idPoint);
      return standAssocie ? standAssocie.nom : point.name;
    },
    getIconForPoint(point) {
      const baseIconUrl = this.icons[point.category] || this.icons.Emplacement;
      const standAssocie = this.stands.find(stand => stand.idPoint === point.idPoint);
      
      let iconUrl = baseIconUrl;
      if (standAssocie) {
        let standType = standAssocie.type.toLowerCase();
        if (standType === 'restaurants') standType = 'Restauration';
        if (standType === 'boutique') standType = 'Boutique';
        iconUrl = this.icons[standType.charAt(0).toUpperCase() + standType.slice(1)];
      }

      const isHovered = this.hoveredPointId === point.idPoint;
      const iconSize = isHovered ? [40, 40] : [30, 30];

      return L.icon({
        iconUrl,
        iconSize,
        iconAnchor: [iconSize[0] / 2, iconSize[1]],
        popupAnchor: [0, -iconSize[1] / 2],
      });
    },
    enlargeIcon(pointId) {
      this.hoveredPointId = pointId;
    },
    resetIcon() {
      this.hoveredPointId = null;
    },
    changeLayer() {
    },
  },
};
</script>

<style scoped>
.page-carte {
  padding-top: 100px;
  max-width: 100%;
}

.map-container {
  max-width: 60%;
  margin: auto;
}

.leaflet-container {
  width: auto;
  border: 5px solid #000000;
  border-radius: 10px;
}

select {
  margin-bottom: 10px;
} 
</style>
