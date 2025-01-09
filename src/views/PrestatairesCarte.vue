<template>
  <div class="page-carte">
    <div class="map-container">
      <h1 class="page-title">Carte de Parthenay</h1>

      <!-- Sélection de la vue de la carte -->
      <select v-model="selectedLayer" @change="changeLayer">
        <option value="osm">Vue Carte</option>
        <option value="satellite">Vue Satellite</option>
      </select>

      <!-- Cases à cocher pour les catégories -->
      <div class="filter-section">
        <h3>Filtres de catégories :</h3>
        <label v-for="category in categories" :key="category">
          <input type="checkbox" :value="category" v-model="selectedCategories" @change="syncEmplacementStatus(category)" />
          {{ category }}
        </label>
      </div>

      <!-- Cases à cocher pour les emplacements disponibles et occupés -->
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

        <!-- Marqueurs avec info-bulle dynamique au survol -->
        <l-marker v-for="(point, index) in filteredPoints" :key="index" :lat-lng="point.coordinates"
          :icon="getIconForPoint(point)">
          <l-popup>{{ getPopupText(point) }}</l-popup>
          <!-- Info-bulle au survol pour les Emplacements -->
          <l-tooltip v-if="point.category === 'Emplacement'">{{ getTooltipText(point) }}</l-tooltip>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";
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
    LTooltip,
  },
  data() {
    const initialCategories = [...new Set(points.map(point => point.category))];
    return {
      zoom: 16,
      minZoom: 13,
      maxZoom: 18,
      center: [46.648, -0.2494],
      bounds: [[46.620, -0.270], [46.680, -0.230]],
      selectedLayer: "osm",
      points,
      stands,
      selectedCategories: initialCategories, // Toutes les catégories sélectionnées par défaut
      emplacementStatus: ["available", "occupied"], // Les deux statuts sont sélectionnés par défaut
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
    filteredPoints() {
      return this.points.filter(point => {
        const categoryMatch = this.selectedCategories.includes(point.category);

        const isEmplacementAvailable = 
          point.category === 'Emplacement' &&
          ((this.emplacementStatus.includes('available') && point.disponible) ||
           (this.emplacementStatus.includes('occupied') && !point.disponible));

        return categoryMatch && (point.category !== 'Emplacement' || isEmplacementAvailable);
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
    getTooltipText(point) {
      if (point.category === 'Emplacement') {
        const standAssocie = this.stands.find(stand => stand.idPoint === point.idPoint);
        return point.disponible ? "Disponible" : (standAssocie ? standAssocie.nom : "Occupé");
      }
      return "";
    },
    getIconForPoint(point) {
  console.log("Traitement du point :", point);

  // Si la catégorie n'est pas "Emplacement", utiliser directement l'icône associée à la catégorie
  if (point.category !== "Emplacement") {
    const icon = this.icons[point.category] || this.icons.Emplacement; // Icône par défaut si non trouvée
    console.log("Icône pour la catégorie :", point.category, "=>", icon);
    return icon;
  }

  // Pour les points de catégorie "Emplacement", vérifier les stands associés
  const standAssocie = this.$store.state.stands.find(
    (stand) => stand.idPoint === point.idPoint
  );

  if (standAssocie) {
    console.log("Stand associé :", standAssocie);

    // Récupérer le compte lié au stand
    const compteId = standAssocie.comptes[0];
    const compte = this.$store.state.comptes.find((compte) => compte.id === compteId);

    if (compte) {
      console.log("Compte associé au stand :", compte);

      // Associer le rôle à l'icône correspondante
      const roleToIconMap = {
        organisateur: "Tournois",
        createur: "Stand",
        restaurateur: "Restauration",
        vendeur: "Boutique",
      };

      const iconKey = roleToIconMap[compte.role] || "Emplacement"; // Icône par défaut pour les rôles inconnus
      console.log("Icône pour le rôle :", compte.role, "=>", this.icons[iconKey]);
      return this.icons[iconKey];
    }

    console.log("Aucun compte trouvé pour ce stand.");
  }

  // Si aucun stand ou compte n'est trouvé, retourner l'icône par défaut pour "Emplacement"
  console.log("Aucun stand trouvé pour ce point d'emplacement.");
  return this.icons.Emplacement;
},
    changeLayer() {
      // Logique pour changer la vue de la carte (rien de spécifique ici)
    },
    syncCategoryCheckbox() {
      if (!this.emplacementStatus.includes('available') && !this.emplacementStatus.includes('occupied')) {
        this.selectedCategories = this.selectedCategories.filter(cat => cat !== 'Emplacement');
      } else if (this.selectedCategories.includes('Emplacement') === false) {
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
