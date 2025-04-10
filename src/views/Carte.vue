<template>
  <div class="page-carte">
    <div class="map-container">
      <h1 class="page-title">{{ $t('mapTitle') }}</h1>

      <select v-model="selectedLayer">
        <option value="osm">{{ $t('mapView') }}</option>
        <option value="satellite">{{ $t('satelliteView') }}</option>
      </select>

      <select v-model="selectedCategory">
        <option value="">{{ $t('allCategories') }}</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ $t(category) }}
        </option>
      </select>

      <l-map :zoom="zoom" :center="center" :max-bounds="bounds" :max-bounds-viscosity="1.0" :min-zoom="minZoom"
             :max-zoom="maxZoom" :options="mapOptions" style="height: 700px; width: 100%;">
        <l-tile-layer :url="layers[selectedLayer].url" :attribution="layers[selectedLayer].attribution"></l-tile-layer>

        <l-marker v-for="(point, index) in filteredPoints" :key="index" :lat-lng="point.coordinates"
                  :icon="getIconForPoint(point)" @mouseover="enlargeIcon(point.id)" @mouseout="resetIcon()"
                  @click="showStandInfo(point)">
          <l-tooltip>{{ getTooltipText(point) }}</l-tooltip>
        </l-marker>
      </l-map>

      <div v-if="selectedStand" class="stand-info-panel">
        <button class="close-button" @click="closeStandInfo">X</button>
        <h2>{{ selectedStand.nom_stand || selectedStand.nom }}</h2>
        <img v-if="selectedStand.image_path" :src="getStandImage(selectedStand)" :alt="$t('standImage')" class="stand-image" />
        <p><strong>{{ $t('type') }}:</strong>
          <span v-if="selectedStand.id_type">{{ getStandType(selectedStand.id_type) }}</span>
          <span v-else>{{ selectedStand.categorie }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LTooltip } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { mapState } from "vuex";

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
    LTooltip,
  },
  data() {
    return {
      mapOptions: {
        attributionControl: false,
      },
      zoom: 16,
      minZoom: 13,
      maxZoom: 18,
      center: [46.648, -0.2494],
      bounds: [[46.620, -0.270], [46.680, -0.230]],
      selectedCategory: "",
      selectedLayer: "osm",
      hoveredPointId: null,
      selectedStand: null,
      layers: {
        osm: {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: '',
        },
        satellite: {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: '',
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
    ...mapState("points", ["points"]),
    ...mapState("stands", ["stands", "typeStands"]),
    filteredPoints() {
      return this.points
          .filter(point => {
            const categoryMatch = this.selectedCategory === "" || point.categorie === this.selectedCategory;

            if (point.categorie === 'Emplacement') {
              return categoryMatch;
            } else {
              return categoryMatch && !point.reserve;
            }
          })
          .map(point => ({
            ...point,
            coordinates: [point.coordonnees_y, point.coordonnees_x]
          }));
    },
    categories() {
      return [...new Set(this.points.map(point => point.categorie))];
    },
  },
  async created() {
    await this.$store.dispatch("points/getAllPoints");
    await this.$store.dispatch("stands/getAllStands");
    await this.$store.dispatch("stands/getAllTypesStand");
  },
  methods: {
    getStandImage(stand) {
        const path = stand.image_path;
        try {
          return require(`@/assets/images/${path}`);
        } catch {
          return require('@/assets/images/null.png');
        }
    },

    getStandType(idType) {
      const type = this.typeStands.find(t => t.id === idType);
      return type ? type.intitule : 'Inconnu';
    },
    getTooltipText(point) {
      const standAssocie = this.stands.find(stand => stand.id_emplacement === point.id);
      return standAssocie ? standAssocie.nom_stand : point.nom;
    },
    getIconForPoint(point) {
      const standAssocie = this.stands.find(stand => stand.id_emplacement === point.id);
      let iconUrl = this.icons.Emplacement;

      if (standAssocie) {
        const typeStand = this.typeStands.find(t => t.id === standAssocie.id_type);
        let standType = typeStand ? typeStand.intitule : 'Emplacement';

        if (standType.toLowerCase() === 'restaurant') standType = 'Restauration';
        if (standType.toLowerCase() === 'boutique') standType = 'Boutique';

        iconUrl = this.icons[standType] || this.icons.Emplacement;
      } else {
        iconUrl = this.icons[point.categorie] || this.icons.Emplacement;
      }

      const isHovered = this.hoveredPointId === point.id;
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
    showStandInfo(point) {
      const stand = this.stands.find(stand => stand.id_emplacement === point.id);
      this.selectedStand = stand || point; // Affiche les infos même sans stand
    },
    closeStandInfo() {
      this.selectedStand = null;
    },
  },
};
</script>

<style scoped>
  .page-carte {
    padding-top: 50px;
    max-width: 100%;
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f9;
  }

  .map-container {
    max-width: 75%;
    margin: 0 auto;
    position: relative;
    padding-bottom: 40px;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    margin-top: 100px;
    color: #333;
  }

  select {
    padding: 10px 15px;
    font-size: 1rem;
    margin-right: 20px;
    border-radius: 5px;
    border: 1px solid #ddd;
    background-color: #fff;
    color: #333;
    outline: none;
    transition: all 0.3s ease;
  }

  select:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  select + select {
    margin-top: 15px;
  }

  select option {
    padding: 10px;
  }

  .stand-info-panel {
    position: absolute;
    top: 100px;
    right: 20px;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 280px;
    z-index: 1000;
    max-height: 80%;
    overflow-y: auto;
  }

  .stand-info-panel h2 {
    margin-top: 0;
    font-size: 1.5rem;
    color: #333;
  }

  .stand-info-panel img {
    max-width: 100%;
    height: auto;
    margin-bottom: 15px;
    border-radius: 8px;
  }

  .stand-info-panel p {
    margin: 15px 0;
    font-size: 1rem;
    line-height: 1.5;
  }

  .stand-info-panel p strong {
    color: #007bff;
  }

  .close-button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    float: right;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin-top: -10px;
  }

  .close-button:hover {
    background-color: #e60000;
  }

  .map-container select {
    margin: 10px 0 30px;
    display: inline-block;
  }

  select:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  .l-map {
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  }

  .l-tooltip {
    font-size: 1rem;
    background-color: rgba(0, 123, 255, 0.9);
    color: white;
    padding: 8px;
    border-radius: 5px;
  }

  .stand-info-panel {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
  }

  .stand-info-panel h2 {
    color: #333;
    font-size: 1.4rem;
    font-weight: bold;
  }

  .stand-info-panel p {
    font-size: 1rem;
    color: #555;
  }

  .stand-info-panel img {
    margin-bottom: 15px;
    border-radius: 5px;
    max-height: 180px;
  }

  .stand-info-panel button {
    background-color: #ff4d4d;
    color: #fff;
    border: none;
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
    font-size: 18px;
  }

  .stand-info-panel button:hover {
    background-color: #e60000;
  }

  .select-container {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
  }

  .select-container select {
    margin-right: 15px;
    font-size: 1rem;
  }

  .stand-info-panel {
    background-color: #ffffff;
    color: #333;
  }

</style>