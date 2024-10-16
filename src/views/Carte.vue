<template>
  <div class="map-container">
    <h1 class="page-title">Carte de Parthenay</h1>

    <select v-model="selectedLayer" @change="changeLayer">
      <option value="osm">Vue Carte</option>
      <option value="satellite">Vue Satellite</option>
    </select>

    <select v-model="selectedCategory" @change="filterPoints">
      <option value="">Toutes les catégories</option>
      <option v-for="category in categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>

    <l-map :zoom="zoom" :center="center" :max-bounds="bounds" :max-bounds-viscosity="1.0" :min-zoom="minZoom"
      :max-zoom="maxZoom" style="height: 700px; width: 100%;">

      <l-tile-layer :url="layers[selectedLayer].url" :attribution="layers[selectedLayer].attribution"></l-tile-layer>

      <l-marker v-for="(point, index) in filteredPoints" :key="index" :lat-lng="point.coordinates"
        :icon="getIconForCategory(point.category)">
        <l-popup>{{ getPopupText(point) }}</l-popup>
      </l-marker>

    </l-map>
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
      zoom: 14,
      minZoom: 13,
      maxZoom: 18,
      center: [46.6513, -0.2494],
      bounds: [[46.620, -0.270], [46.680, -0.230]],
      selectedCategory: "",
      selectedLayer: "osm",
      points,
      stands,
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
        'Toilettes': L.icon({
          iconUrl: toiletIcon,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        }),
        'Parking': L.icon({
          iconUrl: parkingIcon,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        }),
        'Tournois': L.icon({
          iconUrl: tournamentIcon,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        }),
        'Restauration': L.icon({
          iconUrl: restaurationIcon,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        }),
        'Emplacement': L.icon({
          iconUrl: emplacementIcon,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        }),
      },
    };
  },
  computed: {
    filteredPoints() {
      return this.points.filter(point => {
        const categoryMatch = this.selectedCategory === "" || point.category === this.selectedCategory;

        const isEmplacementValid = point.category !== 'Emplacement' || point.disponible === false;

        return categoryMatch && isEmplacementValid;
      });
    },
    categories() {
      return [...new Set(this.points.map(point => point.category))];
    },
    standsAvecCoordonnees() {
      return this.stands.map(stand => {
        const pointAssocie = this.points.find(point => point.idPoint === stand.idPoint);
        if (pointAssocie) {
          return {
            ...stand,
            coordinates: pointAssocie.coordinates,
          };
        }
        return null;
      }).filter(stand => stand !== null);
    },
  },
  methods: {
    getPopupText(point) {
      const standAssocie = this.stands.find(stand => stand.idPoint === point.idPoint);

      if (standAssocie) {
        return standAssocie.nom;
      }

      return point.name;
    },
    getIconForCategory(category) {
      return this.icons[category];
    },
    defaultIcon() {
      return L.icon({
        iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });
    },
    changeLayer() {
    },
  },
};
</script>

<style scoped>
.map-container {
  padding-top: 100px;
  max-width: 95%;
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
