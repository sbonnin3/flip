<template>
  <div class="page-prestation">
    <h1 class="page-title">Gestion de ma prestation</h1>
    <div class="tab-container">
      <button v-if="isTabVisible('Catalogue')" :class="{ active: selectedTab === 'Catalogue' }"
              @click="selectTab('Catalogue')">Catalogue
      </button>
      <button v-if="isTabVisible('Jeux')" :class="{ active: selectedTab === 'Jeux' }" @click="selectTab('Jeux')">Mes
        jeux
      </button>
      <button v-if="isTabVisible('Emplacement')" :class="{ active: selectedTab === 'Emplacement' }"
              @click="selectTab('Emplacement')">Mon emplacement
      </button>
      <button v-if="isTabVisible('MesTournois')" :class="{ active: selectedTab === 'MesTournois' }"
              @click="selectTab('MesTournois')">Mes tournois
      </button>
      <button v-if="isTabVisible('MonRestaurant')" :class="{ active: selectedTab === 'MonRestaurant' }"
              @click="selectTab('MonRestaurant')">Mon restaurant
      </button>
    </div>
    <div v-show="selectedTab === 'MonRestaurant'">
      <template v-if="restaurant">
        <h2>Mon Restaurant</h2>
        <p><strong>Nom :</strong> {{ restaurant.nom_stand }}</p>
        <p>
          <strong>Image :</strong>
          <img :src="restaurant.image_path" alt="Image du restaurant" style="max-width: 300px;"/>
        </p>
        <button @click="openEditRestaurantModal">Modifier le restaurant</button>

        <h3>Liste des Articles Disponibles</h3>
        <div class="articles-container">
          <div v-for="(produit, index) in uniqueArticles" :key="index" class="article-card">
            <img :src="getProduitImage(produit)" alt="Image de l'article" class="article-image"/>
            <div class="article-info">
              <h4>{{ produit.nom_produit }}</h4>
              <p>Prix : {{ produit.prix_produit }} €</p>
              <p>Type : {{ produit.type_article || 'Non spécifié' }}</p>
              <button @click="toggleArticleInRestaurant(produit)"
                      :class="isRestaurantArticle(produit) ? 'remove-button' : 'add-button'">
                {{ isRestaurantArticle(produit) ? 'Supprimer' : 'Ajouter' }}
              </button>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div>
          <label for="newRestaurantName">Nom du restaurant :</label>
          <input id="newRestaurantName" v-model="newRestaurantName" type="text"/>
        </div>
        <div>
          <label for="newRestaurantImage">Image du restaurant :</label>
          <input id="newRestaurantImage" type="file" @change="handleNewRestaurantImage"/>
        </div>
        <button @click="handleCreateRestaurant">Créer un restaurant</button>
      </template>
      <div v-if="showEditRestaurantModal" class="modal">
        <div class="modal-content">
          <span class="close-button" @click="closeEditRestaurantModal">&times;</span>
          <h2>Modifier le restaurant</h2>
          <div class="inputBox">
            <label for="editRestaurantName">Nom du restaurant :</label>
            <input id="editRestaurantName" v-model="editRestaurantDetails.nom" type="text"/>
          </div>
          <div class="imageBox">
            <label for="editRestaurantImage">Image du restaurant :</label>
            <input id="editRestaurantImage" type="file" @change="handleEditRestaurantImage"/>
            <img :src="editRestaurantDetails.image" alt="Prévisualisation" style="max-width: 100%; margin-top: 10px;"/>
          </div>
          <button @click="saveEditedRestaurant" class="confirm-button">Enregistrer</button>
          <button @click="closeEditRestaurantModal" class="cancel-button">Annuler</button>
        </div>
      </div>
    </div>
    <div v-show="selectedTab === 'Catalogue'">
      <div class="cards-container" v-if="jeux.length">
        <div v-for="jeu in jeux" :key="jeu.name" class="card">
          <img :src="getJeuImage(jeu)" alt="Image du jeu" class="card-image"/>
          <div class="card-content">
            <h2 class="card-title">{{ getJeuName(jeu) }}</h2>
            <p class="card-type">Type : {{ jeu.type }}</p>
            <p class="card-players">Nombre de joueurs : {{ jeu.nombre_joueurs_min }}-{{ jeu.nombre_joueurs_max }}</p>
            <p class="card-age">Âge minimum : {{ jeu.age_limite }} ans</p>
            <p class="card-duration">Durée : {{ jeu.duree }} min</p>
            <p class="card-stand">Nom du stand : {{ getStandName(jeu) }}</p>
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
      <div class="cards-container" v-if="filteredUserJeux && filteredUserJeux.length">
        <div v-for="jeu in filteredUserJeux" :key="jeu.id" class="card">
          <img :src="jeu.image_path || require('@/assets/images/null.png')"
               alt="Image du jeu" class="card-image"/>
          <div class="card-content">
            <h2 class="card-title">{{ jeu.produit?.nom_produit || 'Jeu sans nom' }}</h2>
            <p class="card-type">Type : {{ jeu.type || 'Non spécifié' }}</p>
            <p class="card-players">Nombre de joueurs :
              {{ jeu.nombre_joueurs_min || 'N/A' }} - {{ jeu.nombre_joueurs_max || 'N/A' }}</p>
            <p class="card-age">Âge minimum : {{ jeu.age_limite || 'N/A' }} ans</p>
            <p class="card-duration">Durée : {{ jeu.duree || 'N/A' }} min</p>
            <p class="card-stand">Nom du stand : {{ userStand?.nom_stand || 'Non attribué' }}</p>
          </div>
        </div>
      </div>
      <p v-else>Vous n'avez aucun jeu.</p>
      <button class="create-button" @click="openCreationConfirmation">Créer un jeu</button>
      <div v-if="showConfirmation" class="confirmation-modal">
        <div class="modal-content">
          <span class="close-button" @click="closeConfirmation">&times;</span>
          <h2>Création du jeu </h2>
          <div class="inputBox">
            <label for="name">Nom du jeu :</label>
            <input v-model="gameDetails.nom_produit" type="text" id="name" required/>
          </div>
          <div class="inputBox">
            <label for="name">Description du jeu :</label>
            <input v-model="gameDetails.description_produit" type="text" id="name" required/>
          </div>
          <div class="inputBox">
            <label for="type">Type du jeu :</label>
            <select v-model="gameDetails.type" id="type" required>
              <option value="" disabled>Sélectionnez un type</option>
              <option v-for="type in uniqueGameTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div class="inputBox">
            <label for="playerNumber">Nombre de joueurs minimum</label>
            <input v-model="gameDetails.nbJoueursMin" type="number" id="playerNumber" required/>
          </div>
          <div class="inputBox">
            <label for="playerNumber">Nombre de joueurs maximum</label>
            <input v-model="gameDetails.nbJoueursMax" type="number" id="playerNumber" required/>
          </div>
          <div class="inputBox">
            <label for="minimumAge">Âge minimum :</label>
            <input v-model="gameDetails.ageLimite" type="number" id="minimumAge" required min="1"/>
          </div>
          <div class="inputBox">
            <label for="duration">Durée (minutes) :</label>
            <input v-model="gameDetails.duree" type="number" id="duration" required min="1"/>
          </div>
          <div class="imageBox">
            <label for="imageGame">Image du jeu :</label>
            <input type="file" id="imageGame" accept="image/*" required />
            <img v-if="gameDetails.image_path" :src="gameDetails.image_path" class="image-preview" />
          </div>
          <button @click="confirmCreation" class="confirm-button">Confirmer</button>
          <button @click="closeConfirmation" class="cancel-button">Annuler</button>
        </div>
      </div>
    </div>
    <div v-show="selectedTab === 'MesTournois'">
      <div v-if="filteredUserTournois">
        <div class="cards-container">
          <div v-for="tournoi in filteredUserTournois" :key="tournoi.id" class="card">
            <img :src="getTournoiImage(tournoi)" alt="Image du tournoi" class="card-image"/>
            <div class="card-content">
              <h2 class="card-title">{{ tournoi.nom_tournoi }}</h2>
              <p class="card-location">{{ tournoi.lieu }}</p>
              <p class="card-price">Prix : {{ tournoi.prix_entree }}€</p>
            </div>
          </div>
        </div>
      </div>
      <p v-else>Aucun tournoi créé pour l'instant.</p>
      <button class="create-button" @click="openTournoiModal">Créer un tournoi</button>
      <div v-if="showTournoiModal" class="modal">
        <div class="modal-content">
          <span class="close-button" @click="closeTournoiModal">&times;</span>
          <h2>Créer un nouveau tournoi</h2>
          <form @submit.prevent="createTournoi">
            <div class="inputBox">
              <label for="nomTournoi">Nom du tournoi :</label>
              <input v-model="newTournoi.nom_tournoi" type="text" id="nomTournoi" required/>
            </div>
            <div class="inputBox">
              <label for="lieuTournoi">Lieu :</label>
              <input v-model="newTournoi.lieu" type="text" id="lieuTournoi" required/>
            </div>
            <div class="inputBox">
              <label for="prixTournoi">Prix (€) :</label>
              <input v-model="newTournoi.prix_entree" type="number" id="prixTournoi" required/>
            </div>
            <div class="inputBox">
              <label for="imageTournoi">Image :</label>
              <input type="file" id="imageTournoi"/>
            </div>
            <div class="inputBox">
              <label for="participantsMin">Participants minimum :</label>
              <input v-model="newTournoi.participants_min" type="number" id="participantsMin" required/>
            </div>
            <div class="inputBox">
              <label for="participantsMax">Participants maximum :</label>
              <input v-model="newTournoi.participants_max" type="number" id="participantsMax" required/>
            </div>
            <div class="inputBox">
              <label for="descriptionTournoi">Description :</label>
              <textarea v-model="newTournoi.description_tournoi" id="descriptionTournoi" rows="4"></textarea>
            </div>
            <template>
              <div class="inputBox">
                <label for="dateDebut">Date de début :</label>
                <input
                    type="datetime-local"
                    id="dateDebut"
                    v-model="newTournoi.date_debut"
                    required
                />
              </div>

              <div class="inputBox">
                <label for="dateFin">Date de fin :</label>
                <input
                    type="datetime-local"
                    id="dateFin"
                    v-model="newTournoi.date_fin"
                    required
                />
              </div>
            </template>

            <button type="submit" class="confirm-button">Créer</button>
          </form>
        </div>
      </div>
    </div>
    <div v-show="selectedTab === 'Emplacement'">
      <div class="prestation-emplacement">
        <form @submit.prevent="saveStand">
          <div class="form-group">
            <label for="nom">Nom du Stand :</label>
            <input type="text" v-model="stand.nom_stand" id="nom_stand" required/>
          </div>
          <div class="form-group">
            <label for="type">Type de Stand :</label>
            <select v-model="stand.id_type" id="type" required>
              <option v-for="type in typeStands" :key="type.id" :value="type.id">
                {{ type.intitule }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="nom">Description du Stand :</label>
            <input type="text" v-model="stand.description" id="description" required/>
          </div>
          <div class="form-group">
            <label for="image">Image du Stand :</label>
            <input type="file" @change="handleImageUpload" id="image"/>
            <div v-if="stand.image_path">
              <img :src="stand.image_path" alt="Image du stand" class="stand-image"/>
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
                    style="height: 500px;" @ready="mapReady">
              <l-tile-layer :url="layers[selectedLayer].url"
                            :attribution="layers[selectedLayer].attribution"></l-tile-layer>
              <l-marker v-for="point in availablePoints" :key="point.id"
                        :lat-lng="[point.coordonnees_y, point.coordonnees_x]"
                        :icon="getIconForPoint(point)" @click="selectPoint(point)">
                <l-tooltip>
                  {{ point === selectedPoint ? 'Point sélectionné' : 'Disponible - Cliquez pour sélectionner' }}
                </l-tooltip>
              </l-marker>
            </l-map>
            <p v-if="selectedPoint" class="selected-point-info">
              Point sélectionné : {{ selectedPoint.id }}
            </p>
            <p v-else class="no-selection-info">
              Veuillez sélectionner un point sur la carte
            </p>
            <transition name="fade">
              <div v-if="showSuccessMessage" class="success-message">
                Votre stand a été enregistré avec succès !
              </div>
            </transition>
          </div>
          <button type="submit" class="save-button" :disabled="loading">
            {{ loading ? 'Enregistrement...' : (isNewStand ? 'Créer le stand' : 'Enregistrer les modifications') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import {mapState} from "vuex";
import {LMap, LTileLayer, LMarker, LTooltip} from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import emplacementIcon from "@/assets/icons/emplacement-icon.png";
import selectedIcon from "@/assets/icons/selected-icon.png";

// Fix pour les icônes Leaflet manquantes
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

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
      showEditRestaurantModal: false,
      editRestaurantDetails: {
        nom: '',
        image: '',
      },
      newRestaurantName: '',
      newRestaurantImage: '',
      showTournoiModal: false,
      newTournoi: {
        lieu: "",
        participants_min: null,
        participants_max: null,
        prix_entree: null,
        nom_tournoi: "",
        description_tournoi: "",
        image: "",
        date_debut: "",
        date_fin: "",
      },
      stand: {
        id: null,
        nom_stand: "",
        id_type: "",
        id_emplacement: null,
        description: "",
        comptes: [],
        image_path: null,
      },
      selectedTab: "",
      selectedJeu: null,
      showConfirmation: false,
      gameDetails: {
        id: null,
        nom_produit: "",
        description_produit: "",
        prix_produit: null,
        stocks: null,
        nbJoueursMin: null,
        nbJoueursMax: null,
        ageLimite: null,
        type: "",
        duree: null,
        image_path: "",
      },
      isNewStand: true,
      selectedPoint: null,
      originalPointId: null,
      zoom: 16,
      minZoom: 13,
      maxZoom: 18,
      center: [46.648, -0.2494],
      bounds: [[46.620, -0.270], [46.680, -0.230]],
      selectedLayer: "osm",
      map: null, // Ajout de la référence à la map
      layers: {
        osm: {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: '&copy; OpenStreetMap contributors'
        },
        satellite: {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: '&copy; Esri'
        }
      },
      showSuccessMessage: false,
      loading: false
    };
  },
  computed: {
    ...mapState("jeux", ["jeux", "jeuxCreation"]),
    ...mapState("tournois", ["tournois"]),
    ...mapState("points", ["points"]),
    ...mapState("stands", ["stands", "typeStands"]),
    ...mapState("user", ["comptes", "actualUser"]),
    ...mapState("produits", ["produits"]),

    lastTournamentId() {
      return this.$store.getters['tournois/lastCreatedTournoiId'];
    },

    uniqueGameTypes() {
      const types = new Set();
      this.jeux.forEach(jeu => {
        if (jeu.type) types.add(jeu.type);
      });
      return Array.from(types).sort();
    },

    filteredUserJeux() {
      if (!this.userStand) return [];
      return this.jeux.filter(jeu => {
        return jeu.produit && jeu.produit.vendupar === this.userStand.id;
      });
    },

    restaurants() {
      if (!this.stands || !Array.isArray(this.stands)) return [];
      const userId = this.actualUser.id;
      return this.stands.filter(stand =>
          stand.id_type === 5 &&
          stand.comptes &&
          stand.comptes.includes(userId)
      );
    },

    filteredUserTournois() {
      if (!this.userStand) return [];
      return this.tournois.filter(tournoi => {
        return tournoi.id_stand === this.userStand.id;
      });
    },

    userStand() {
      if (!this.actualUser || !this.stands) return null;
      return this.stands.find(stand =>
          stand.comptes.includes(this.actualUser.id)
      );
    },

    availablePoints() {
      return this.points
          .filter(point => {
            // Validation des coordonnées
            if (!point.coordonnees_x || !point.coordonnees_y ||
                isNaN(point.coordonnees_x) || isNaN(point.coordonnees_y)) {
              return false;
            }
            return point.categorie === 'Emplacement' && !point.reserve;
          })
          .map(point => ({
            id: point.id,
            coordonnees_x: point.coordonnees_x,
            coordonnees_y: point.coordonnees_y,
            reserve: point.reserve,
            nom: point.nom
          }));
    },

    safeJeux() {
      return this.allJeux || [];
    },
    safeJeuxCreation() { // Ajoutez cette computed property
      return this.jeuxCreation;
    },
    safePoints() {
      return this.availablePoints || [];
    },
    userRole() {
      console.log("User session:", JSON.stringify(this.actualUser));
      return this.actualUser?.role || '';
    },
    restaurant() {
      if (!this.stands || !Array.isArray(this.stands)) return null;
      const userId = this.actualUser.id;
      const userRestaurants = this.stands.filter(stand =>
          stand.id_type === 5 &&
          stand.comptes &&
          stand.comptes.includes(userId)
      );
      return userRestaurants.length > 0 ? userRestaurants[0] : null;
    },
    uniqueArticles() {
      if (!this.restaurant?.id || !Array.isArray(this.produits)) {
        return [];
      }
      console.log("ici le test restaurant !!!" + JSON.stringify(this.produits.filter(produit =>
          (produit.type_article === 'Nourriture' || produit.type_article === 'Boisson')
      )))

      return this.produits.filter(produit =>
          (produit.type_article === 'Nourriture' || produit.type_article === 'Boisson')
      );
    },
    restaurantArticles() {
      if (!this.restaurant) return [];
      return [
        ...(this.restaurant.nourritures || []),
        ...(this.restaurant.boissons || [])
      ].map(item => item.nom);
    },
    allArticles() {
      const articles = [];
      this.allStands.forEach(stand => {
        if (stand.nourritures) {
          articles.push(...stand.nourritures.map(item => ({...item, type: 'Nourriture'})));
        }
        if (stand.boissons) {
          articles.push(...stand.boissons.map(item => ({...item, type: 'Boisson'})));
        }
      });
      return articles;
    },
    mesTournois() {
      return []
      // return this.tournoisByUser(this.userSession?.id) || [];
    }
  },

  async created() {
    await this.$store.dispatch("jeux/getAllJeux");
    await this.$store.dispatch("points/getAllPoints");
    await this.$store.dispatch("stands/getAllStands");
    await this.$store.dispatch("stands/getAllTypesStand");
    await this.$store.dispatch("user/initComptes");
    await this.$store.dispatch("produits/getAllProduits")
    if (this.userStand) {
      // Remplit les champs avec le stand existant
      this.stand = {
        id: this.userStand.id,
        nom_stand: this.userStand.nom_stand,
        id_type: this.userStand.id_type,
        id_emplacement: this.userStand.id_emplacement,
        comptes: this.userStand.comptes,
        image_path: this.userStand.image_path
      };

      // Trouve le point correspondant
      this.selectedPoint = this.availablePoints.find(
          p => p.id === this.userStand.id_emplacement
      );
    }
  },
  methods: {
    ...mapActions("restaurants", [
      "initializeRestaurants",
      "updateRestaurant",
      "addRestaurant",
      "saveStand"
    ]),
    ...mapActions("tournois", ["addTournoi", "fetchTournois"]),
    ...mapActions("points", ["updatePointAvailability", "initializePoints"]),
    ...mapActions("jeux", ["getAllJeux"]),

    getProduitImage(produit) {
      const path = produit.image_path;
      try {
        return require(`@/assets/images/${path}`);
      } catch {
        return require('@/assets/images/null.png');
      }
    },

    getTournoiImage(tournoi) {
      const path = tournoi.image_path;
      try {
        return require(`@/assets/images/${path}`);
      } catch {
        return require('@/assets/images/null.png');
      }
    },

    formatForInput(date) {
      if (!date) return '';
      const d = new Date(date);
      const pad = n => n.toString().padStart(2, '0');
      const yyyy = d.getFullYear();
      const MM = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mm = pad(d.getMinutes());
      return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
    },
    convertToFullISOString(value) {
      const local = new Date(value);
      return local.toISOString(); // Ex: "2025-04-13T01:39:00.000Z"
    },

    formatDateInput(field) {
      // Convertit la date locale en format ISO 8601
      if (this.newTournoi[field]) {
        const date = new Date(this.newTournoi[field]);
        this.newTournoi[field] = date.toISOString();
      }
    },


    getJeuName(jeu) {
      return jeu.produit?.nom_produit || jeu.nom || 'Jeu sans nom';
    },

    getJeuImage(jeu) {
      const path = jeu.produit.image_path;
      try {
        return require(`@/assets/images/${path}`);
      } catch {
        return require('@/assets/images/null.png');
      }
    },

    getStandName(jeu) {
      if (!jeu?.produit?.vendupar) return this.$t('unknownStand');
      const standId = jeu.produit.vendupar;
      const stand = this.$store.state.stands.stands.find(s =>
          s.id === standId || s.idStand == standId
      );
      return stand?.nom_stand || this.$t('unknownStand');
    },

    // Méthodes manquantes référencées dans le template
    openCreationConfirmation() {
      this.showConfirmation = true;
    },

    getStandType() {
      const roleMap = {
        createur: "stand de jeux",
        restaurateur: "restaurant",
        vendeur: "boutique",
        organisateur: "tournois"
      };
      return roleMap[this.actualUser.role] || "autre";
    },

    closeConfirmation() {
      this.showConfirmation = false;
    },

    async confirmCreation() {
      try {
        const jeuData = {
          name: this.gameDetails.nom_produit,
          description_produit: this.gameDetails.description_produit,
          nbJoueursMin: Number(this.gameDetails.nbJoueursMin), // Conversion explicite
          nbJoueursMax: Number(this.gameDetails.nbJoueursMax), // Conversion explicite
          ageLimite: Number(this.gameDetails.ageLimite),       // Conversion explicite
          type: this.gameDetails.type,
          duree: Number(this.gameDetails.duree),              // Conversion explicite
          id_stand: Number(this.userStand.id), // Conversion explicite si nécessaire
          image_path: this.gameDetails.image_path,
        };

        await this.$store.dispatch('jeux/createJeu', jeuData);

        // Réinitialiser le formulaire
        this.gameDetails = {
          id: null,
          nom_produit: "",
          description_produit: "",
          prix_produit: null,
          stocks: null,
          nbJoueursMin: null,
          nbJoueursMax: null,
          ageLimite: null,
          type: "",
          duree: null,
          image_path: "",
        };

        // Fermer la modal
        this.closeConfirmation();

        await this.$store.dispatch('jeux/getAllJeux');

        // Afficher un message de succès
        this.$toast.success("Jeu créé avec succès !");

      } catch (error) {
        console.error("Erreur création jeu:", error);
        this.$toast.error("Erreur lors de la création du jeu");
      }
    },

    openTournoiModal() {
      this.showTournoiModal = true;
    },

    closeTournoiModal() {
      this.showTournoiModal = false;
      this.isEditing = false;
      this.editingTournoiId = null;
      this.resetTournoiForm();
    },

    changeLayer() {
      // Changer la couche de la carte
      if (this.map) {
        this.map.invalidateSize();
      }
    },

    mapReady(map) {
      this.map = map;
      this.map.invalidateSize();
    },

    selectPoint(point) {
      if (point.reserve) {
        this.$toast.warning("Cet emplacement est déjà occupé");
        return;
      }

      this.selectedPoint = point;
      console.log("tranquille je vais pas ragequit:" + point.id);
      this.stand.id_emplacement = point.id;

      // Force le redraw des marqueurs
      if (this.map) {
        this.map.invalidateSize();
      }
    },

    openEditTournoiModal(tournoi) {
      this.editingTournoiId = tournoi._id;
      this.isEditing = true;
      this.newTournoi = {
        nom: tournoi.nom,
        lieu: tournoi.lieu,
        prix: tournoi.prix,
        image: tournoi.image, // Conserve l'URL existante
        description: tournoi.description,
        dates: [...tournoi.dates]
      };
      this.showTournoiModal = true;
    },

    async submitTournoi() {
      try {
        const tournoiData = {
          ...this.newTournoi,
          _id: this.isEditing ? this.editingTournoiId : Date.now().toString(),
          prestataireId: this.actualUser.id
        };

        if (this.isEditing) {
          await this.$store.dispatch('tournois/updateTournoi', tournoiData);
          this.$toast.success("Tournoi modifié avec succès !");
        } else {
          await this.$store.dispatch('tournois/addTournoi', tournoiData);
          this.$toast.success("Tournoi créé avec succès !");
        }

        this.closeTournoiModal();
        await this.$store.dispatch('tournois/fetchTournois');
      } catch (error) {
        this.$toast.error(`Erreur: ${error.message}`);
      }
    },

    async updateTournoi() {
      if (!this.validateTournoi()) return;

      try {
        const updatedTournoi = {
          ...this.newTournoi,
          _id: this.editingTournoiId,
          prestataireId: this.actualUser.id
        };

        await this.$store.dispatch('tournois/updateTournoi', updatedTournoi);
        this.closeTournoiModal();
        this.$toast.success("Tournoi mis à jour avec succès !");
      } catch (error) {
        console.error("Erreur mise à jour tournoi:", error);
        this.$toast.error("Erreur lors de la mise à jour du tournoi");
      }
    },

    async loadJeuxCreation() {
      try {
        this.jeuxCreation = await this.$store.dispatch("jeux/fetchJeuxCreation");
      } catch (error) {
        console.error("Error loading jeuxCreation:", error);
        this.jeuxCreation = [];
      }
    },

    async loadJeux() {
      try {
        await this.$store.dispatch("jeux/getAllJeux"); // Assurez-vous que cette action existe
        // Force le re-rendu si nécessaire
        this.$forceUpdate();
      } catch (error) {
        console.error("Erreur chargement jeux:", error);
      }
    },

    async initializeData() {
      try {
        await Promise.all([
          this.initializeRestaurants(),
          this.fetchTournois(),
          this.initializePoints()
        ]);


      } catch (error) {
        console.error("Initialization error:", error);
        throw error;
      }
    },

    initializeTabs() {
      const tabsOrder = ["Catalogue", "Jeux", "Emplacement", "MesTournois", "MonRestaurant"];
      this.selectedTab = tabsOrder.find(tab => this.isTabVisible(tab)) || "";
    },

    isTabVisible(tab) {
      const tabPermissions = {
        Catalogue: ["vendeur", "createur"],
        Jeux: ["vendeur", "createur"],
        Emplacement: ["vendeur", "createur", "restaurateur", "organisateur"],
        MesTournois: ["organisateur"],
        MonRestaurant: ["restaurateur"],
      };
      return tabPermissions[tab]?.includes(this.userRole);
    },

    initializeStand() {
      if (!this.actualUser?.id) return;

      const roleToTypeMap = {
        createur: "stand",
        restaurateur: "restaurant",
        vendeur: "boutique",
        organisateur: "tournois"
      };

      this.stand = {
        ...this.stand,
        type: roleToTypeMap[this.actualUser.role] || "autre",
        comptes: [this.actualUser.id]
      };
    },

    // Restaurant methods
    toggleArticleInRestaurant(article) {
      if (!this.restaurant) {
        alert("Veuillez créer un restaurant avant d'ajouter ou supprimer des articles.");
        return;
      }

      const listKey = article.type === "Nourriture" ? "nourritures" : "boissons";
      const updatedList = [...this.restaurant[listKey]];
      const articleIndex = updatedList.findIndex(item => item.nom === article.nom);

      if (articleIndex !== -1) {
        updatedList.splice(articleIndex, 1);
        alert(`L'article "${article.nom}" a été supprimé de votre restaurant.`);
      } else {
        updatedList.push(article);
        alert(`L'article "${article.nom}" a été ajouté à votre restaurant.`);
      }

      this.updateRestaurant({
        ...this.restaurant,
        [listKey]: updatedList
      });
    },

    isRestaurantArticle(article) {
      const listKey = article.type === "Nourriture" ? "nourritures" : "boissons";
      return this.restaurant?.[listKey]?.some(item => item.nom === article.nom) || false;
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Vérifier la taille du fichier (max 2MB par exemple)
      if (file.size > 2 * 1024 * 1024) {
        this.$toast.warning("L'image ne doit pas dépasser 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.stand.image = e.target.result;
      };
      reader.onerror = () => {
        this.$toast.error("Erreur lors de la lecture du fichier");
      };
      reader.readAsDataURL(file);
    },

    // Dans les méthodes de PagePrestataires.vue
    handlePaymentSuccessJeu() {
      const currentUser = this.$store.state.user.actualUser;
      const maxOrderNumber = Math.max(
          ...this.$store.state.commandes.userOrders.map(order => order.orderNumber || 0),
          0
      );

      const newOrder = {
        userId: currentUser.id,
        orderNumber: maxOrderNumber + 1,
        articles: [{
          id: this.selectedModalJeu._id,
          nom: this.selectedModalJeu.name,
          prix: this.selectedModalJeu.prix,
          image: this.selectedModalJeu.image,
          quantite: 1
        }],
        type: 'boutique',
        status: 'Confirmée'
      };

      this.$store.dispatch('commandes/addArticleOrder', newOrder);
      this.commandMessage = "Paiement effectué. Votre commande a été confirmée !";

      this.closeModalJeu();
      this.closeConfirmationBoutique();
      this.closePaymentModalBoutique();
    },

    getIconForPoint(point) {
      // Vérifiez que les icônes sont bien chargées
      if (!emplacementIcon || !selectedIcon) {
        console.error('Les icônes ne sont pas chargées correctement');
        return L.divIcon({className: 'custom-marker'});
      }

      const isSelected = this.selectedPoint && this.selectedPoint.id === point.id;

      return L.icon({
        iconUrl: isSelected ? selectedIcon : emplacementIcon,
        iconSize: isSelected ? [35, 35] : [25, 25],
        iconAnchor: isSelected ? [17, 35] : [12, 25],
        popupAnchor: [0, -30]
      });
    },

    async saveStand() {
      this.loading = true;

      try {
        // Validation
        if (!this.stand.nom_stand) throw new Error("Nom du stand manquant");
        if (!this.selectedPoint) throw new Error("Pas d'emplacement sélectionné");

        const standData = {
          nom: this.stand.nom_stand,
          type: this.stand.id_type,
          emplacement: this.selectedPoint.id,
          description: this.stand.description,
          compte: [this.actualUser.id],
          image: this.stand.image_path
        };

        // set l'userstand au stand ajoute:



        if (this.userStand) {
          // Mise à jour du stand existant
          standData.id = this.userStand.id;
          await this.$store.dispatch('stands/updateStand', {
            id: this.userStand.id,
            data: {
              nom: standData.nom_stand,
              type: standData.id_type,
              emplacement: standData.id_emplacement,
              description: standData.description,
              comptes: standData.comptes,
              image: standData.image_path
            }
          });
          alert("Stand mis à jour avec succès", "success");
        } else {
          // Création d'un nouveau stand
          await this.$store.dispatch('stands/addStand', standData);
          alert("Stand crée avec succès", "success");
        }

        // Rafraîchir les données
        await this.$store.dispatch('stands/getAllStands');
        await this.$store.dispatch('points/getAllPoints');

        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);

      } catch (error) {
        console.error("Erreur saveStand:", error);
        this.$toast.error("Erreur lors de l'enregistrement: " + error.message);
      } finally {
        this.loading = false;
      }
    },

    async createTournoi() {
      if (!this.validateTournoi()) return;

      try {
        let imageUrl = null;

        // Gestion de l'image
        if (this.newTournoi.image instanceof File) {
          imageUrl = URL.createObjectURL(this.newTournoi.image);
        } else if (typeof this.newTournoi.image === 'string') {
          imageUrl = this.newTournoi.image;
        } else {
          imageUrl = require('@/assets/images/null.png');
        }

        // 1. Création du tournoi principal
        const tournoiData = {
          id_stand: this.userStand.id,
          lieu: this.newTournoi.lieu,
          participants_min: this.newTournoi.participants_min,
          participants_max: this.newTournoi.participants_max,
          prix_entree: this.newTournoi.prix_entree,
          nom_tournoi: this.newTournoi.nom_tournoi,
          description_tournoi: this.newTournoi.description_tournoi,
          image: imageUrl
        };

        await this.$store.dispatch('tournois/createTournoi', tournoiData);
        await this.$store.dispatch("tournois/getAllTournois");

        const editionData = {
          id_tournoi: this.lastTournamentId, // Utilisation de l'ID du tournoi créé
          date_debut: this.convertToFullISOString(this.newTournoi.date_debut),
          date_fin: this.convertToFullISOString(this.newTournoi.date_fin),
        };

        await this.$store.dispatch('tournois/createEditionTournoi', editionData);

        this.closeTournoiModal();

        // Réinitialisation
        this.newTournoi = {
            lieu: "",
            participants_min: null,
            participants_max: null,
            prix_entree: null,
            nom_tournoi: "",
            description_tournoi: "",
            image: "",
            date_debut: "",
            date_fin: "",
        };

        await this.$store.dispatch('tournois/getAllTournois');

      } catch (error) {
        console.error("Erreur création tournoi:", error);
      }
    },

    // Ajouter cette méthode pour formater correctement les dates
    formatTournoiDates(dates) {
      return dates.map(date => ({
        ...date,
        placesRestantes: Number(date.placesRestantes) || 0
      }));
    },

    validateTournoi() {
      if (!this.newTournoi.nom_tournoi) {
        this.$toast.warning("Veuillez entrer un nom pour le tournoi");
        return false;
      }

      if (this.newTournoi.date_debut.length === 0 || this.newTournoi.date_fin.length === 0) {
        this.$toast.warning("Veuillez ajouter au moins une date");
        return false;
      }

      return true;
    },

    handleTournoiImageUpload(event) {
      this.newTournoi.image = event.target.files[0]; // Stocke l'objet File directement
    },

    // Common methods
    async selectTab(tab) {
      this.selectedTab = tab;

      // Recharger les données quand on va sur l'onglet Catalogue
      if (tab === 'Catalogue') {
        await this.loadJeux();
      }

      // Redimensionner la carte si on va sur l'onglet Emplacement
      if (tab === 'Emplacement' && this.map) {
        this.$nextTick(() => this.map.invalidateSize());
      }
    },

    formatDate(date) {
      if (!date) return "Date invalide";
      if (typeof date === 'object') {
        return `${date.jour}/${date.mois}/${date.annee} ${date.heures}h${date.min}`;
      }
      return new Date(date).toLocaleDateString("fr-FR");
    },

    // Méthodes pour la gestion des dates des tournois
    addDate() {
      this.newTournoi.dates.push({
        jour: '',
        mois: '',
        annee: '',
        heures: '',
        min: '',
        placesRestantes: 0
      });
    },

    removeDate(index) {
      this.newTournoi.dates.splice(index, 1);
    },

    // Méthodes pour la gestion du restaurant
    openEditRestaurantModal() {
      this.editRestaurantDetails = {
        nom: this.restaurant.nom,
        image: this.restaurant.image
      };
      this.showEditRestaurantModal = true;
    },

    closeEditRestaurantModal() {
      this.showEditRestaurantModal = false;
    },

    saveEditedRestaurant() {
      this.updateRestaurant({
        ...this.restaurant,
        ...this.editRestaurantDetails
      });
      this.closeEditRestaurantModal();
    },

    handleNewRestaurantImage(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.newRestaurantImage = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    handleEditRestaurantImage(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.editRestaurantDetails.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    async handleCreateRestaurant() {
      if (!this.newRestaurantName) {
        alert("Veuillez entrer un nom pour le restaurant");
        return;
      }

      try {
        await this.addRestaurant({
          nom: this.newRestaurantName,
          image: this.newRestaurantImage,
          idPoint: this.selectedPoint.id,
          comptes: [this.actualUser.id]
        });
        this.newRestaurantName = '';
        this.newRestaurantImage = '';
      } catch (error) {
        console.error("Erreur création restaurant:", error);
      }
    }
  },
  watch: {
    selectedTab(newVal) {
      if (newVal === "Emplacement" && this.map) {
        this.$nextTick(() => this.map.invalidateSize());
      }
    },
  }
};
</script>

<style scoped>
.article-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  text-align: center;
  transition: background-color 0.3s ease;
}

.article-restaurant {
  background-color: #e6ffe6;
}

.article-other {
  background-color: #f0f0f0;
}

.add-button {
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #45a049;
}

.remove-button {
  background-color: #f44336;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #e53935;
}

.article-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 10px;
}

.article-info {
  text-align: left;
}

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

.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #4CAF50;
  color: white;
  padding: 15px;
  border-radius: 5px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
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

.success-message {
  padding: 15px;
  background-color: #4CAF50;
  color: white;
  margin-top: 20px;
  border-radius: 4px;
  text-align: center;
}

.article {
  margin: 10px 0;
}

.article-name {
  font-size: 1.2em;
  font-weight: bold;
}

.article-price {
  color: green;
}

.articles-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

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

/* Dans le style de PageMaPrestation.vue */
.tournoi-form {
  max-width: 800px;
  margin: 0 auto;
}

.inputBox {
  margin-bottom: 15px;
}

.inputBox label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.inputBox input,
.inputBox textarea,
.inputBox select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.date-fields {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.date-fields input {
  width: 60px;
}

.confirm-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.cancel-button {
  background-color: #f44336;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.leaflet-container {
  height: 500px;
  width: 100%;
  z-index: 0;
  /* Important pour que la carte soit cliquable */
}

.leaflet-marker-icon {
  background-image: url('~leaflet/dist/images/marker-icon.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.map-container {
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}
</style>