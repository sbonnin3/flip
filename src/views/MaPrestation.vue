<template>
  <div class="page-prestation">
    <h1 class="page-title">Gestion de ma prestation</h1>
    <div class="tab-container">
      <button v-if="isTabVisible('Catalogue')" :class="{ active: selectedTab === 'Catalogue' }"
        @click="selectTab('Catalogue')">Catalogue</button>
      <button v-if="isTabVisible('Jeux')" :class="{ active: selectedTab === 'Jeux' }" @click="selectTab('Jeux')">Mes
        jeux</button>
      <button v-if="isTabVisible('Emplacement')" :class="{ active: selectedTab === 'Emplacement' }"
        @click="selectTab('Emplacement')">Mon emplacement</button>
      <button v-if="isTabVisible('MesTournois')" :class="{ active: selectedTab === 'MesTournois' }"
        @click="selectTab('MesTournois')">Mes tournois</button>
      <button v-if="isTabVisible('MonRestaurant')" :class="{ active: selectedTab === 'MonRestaurant' }"
        @click="selectTab('MonRestaurant')">Mon restaurant</button>
    </div>
    <div v-show="selectedTab === 'MonRestaurant'">
      <template v-if="restaurant">
        <h2>Mon Restaurant</h2>
        <p><strong>Nom :</strong> {{ restaurant.nom }}</p>
        <p>
          <strong>Image :</strong>
          <img :src="restaurant.image" alt="Image du restaurant" style="max-width: 300px;" />
        </p>
        <button @click="openEditRestaurantModal">Modifier le restaurant</button>

        <h3>Liste des Articles Disponibles</h3>
        <div class="articles-container">
          <div v-for="(article, index) in uniqueArticles" :key="index" class="article-card"
            :class="{ 'article-restaurant': isRestaurantArticle(article), 'article-other': !isRestaurantArticle(article) }">
            <img :src="article.image" alt="Image de l'article" class="article-image" />
            <div class="article-info">
              <h4>{{ article.nom }}</h4>
              <p>Prix : {{ article.prix }} €</p>
              <p>Type : {{ article.type || 'Non spécifié' }}</p>
              <button @click="toggleArticleInRestaurant(article)"
                :class="isRestaurantArticle(article) ? 'remove-button' : 'add-button'">
                {{ isRestaurantArticle(article) ? 'Supprimer' : 'Ajouter' }}
              </button>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div>
          <label for="newRestaurantName">Nom du restaurant :</label>
          <input id="newRestaurantName" v-model="newRestaurantName" type="text" />
        </div>
        <div>
          <label for="newRestaurantImage">Image du restaurant :</label>
          <input id="newRestaurantImage" type="file" @change="handleNewRestaurantImage" />
        </div>
        <button @click="handleCreateRestaurant">Créer un restaurant</button>
      </template>
      <div v-if="showEditRestaurantModal" class="modal">
        <div class="modal-content">
          <span class="close-button" @click="closeEditRestaurantModal">&times;</span>
          <h2>Modifier le restaurant</h2>
          <div class="inputBox">
            <label for="editRestaurantName">Nom du restaurant :</label>
            <input id="editRestaurantName" v-model="editRestaurantDetails.nom" type="text" />
          </div>
          <div class="imageBox">
            <label for="editRestaurantImage">Image du restaurant :</label>
            <input id="editRestaurantImage" type="file" @change="handleEditRestaurantImage" />
            <img :src="editRestaurantDetails.image" alt="Prévisualisation" style="max-width: 100%; margin-top: 10px;" />
          </div>
          <button @click="saveEditedRestaurant" class="confirm-button">Enregistrer</button>
          <button @click="closeEditRestaurantModal" class="cancel-button">Annuler</button>
        </div>
      </div>
    </div>
    <div v-show="selectedTab === 'Catalogue'">
      <div class="cards-container" v-if="jeux.length">
        <div v-for="jeu in jeux" :key="jeu.name" class="card">
          <img :src="getJeuImage(jeu)" alt="Image du jeu" class="card-image" />
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
            <img :src="selectedJeu.image" alt="Image du jeu" class="modal-image" />
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
      <div class="cards-container" v-if="safeJeuxCreation.length">
        <div v-for="jeu in jeuxCreation" :key="jeu.name" class="card">
          <img :src="jeu.image" alt="Image du jeu" class="card-image" />
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
          <div class="imageBox">
            <label for="imageGame">Image du jeu :</label>
            <input type="file" id="imageGame" />
          </div>
          <button @click="confirmCreation" class="confirm-button">Confirmer</button>
          <button @click="closeConfirmation" class="cancel-button">Annuler</button>
        </div>
      </div>
    </div>
    <div v-show="selectedTab === 'MesTournois'">
      <div v-if="mesTournois.length">
        <div class="cards-container">
          <div v-for="tournoi in mesTournois" :key="tournoi._id" class="card">
            <img :src="tournoi.image" alt="Image du tournoi" class="card-image" />
            <div class="card-content">
              <h2 class="card-title">{{ tournoi.nom }}</h2>
              <p class="card-location">{{ tournoi.lieu }}</p>
              <p class="card-price">Prix : {{ tournoi.prix }}€</p>
              <p class="card-dates">
                Dates :
                <span v-for="date in tournoi.dates" :key="date">
                  {{ formatDate(date) }} - {{ date.placesRestantes }} places
                </span>
              </p>
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
              <input v-model="newTournoi.nom" type="text" id="nomTournoi" required />
            </div>
            <div class="inputBox">
              <label for="lieuTournoi">Lieu :</label>
              <input v-model="newTournoi.lieu" type="text" id="lieuTournoi" required />
            </div>
            <div class="inputBox">
              <label for="prixTournoi">Prix (€) :</label>
              <input v-model="newTournoi.prix" type="number" id="prixTournoi" required />
            </div>
            <div class="inputBox">
              <label for="imageTournoi">Image :</label>
              <input type="file" id="imageTournoi" @change="handleTournoiImageUpload" />
            </div>
            <div class="inputBox">
              <label for="descriptionTournoi">Description :</label>
              <textarea v-model="newTournoi.description" id="descriptionTournoi" rows="4"></textarea>
            </div>
            <div class="inputBox">
              <label>Dates :</label>
              <button @click.prevent="addDate">Ajouter une date</button>
              <div v-for="(date, index) in newTournoi.dates" :key="index" class="date-fields">
                <input v-model="date.jour" type="number" placeholder="Jour" min="1" max="31" />
                <input v-model="date.mois" type="number" placeholder="Mois" min="1" max="12" />
                <input v-model="date.annee" type="number" placeholder="Année" />
                <input v-model="date.heures" type="number" placeholder="Heures" min="0" max="23" />
                <input v-model="date.min" type="number" placeholder="Minutes" min="0" max="59" />
                <input v-model="date.placesRestantes" type="number" placeholder="Places restantes" min="1" />
                <button @click.prevent="removeDate(index)">Supprimer</button>
              </div>
            </div>
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
            <input type="text" v-model="stand.nom" id="nom" required />
          </div>
          <div class="form-group">
            <label for="description">Description de la prestation :</label>
            <textarea v-model="stand.description" id="description" rows="4" placeholder="Décrivez votre prestation..."
              required></textarea>
          </div>
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
              <l-marker v-for="point in availablePoints" :key="point.id" :lat-lng="[point.coordonnees_y, point.coordonnees_x]"
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
import { mapState } from "vuex";
import { LMap, LTileLayer, LMarker, LTooltip } from "vue2-leaflet";
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
      jeuxCreation: [],
      showEditRestaurantModal: false,
      editRestaurantDetails: {
        nom: '',
        image: '',
      },
      newRestaurantName: '',
      newRestaurantImage: '',
      showTournoiModal: false,
      newTournoi: {
        nom: '',
        lieu: '',
        prix: 0,
        image: null,
        description: '',
        dates: [],
      },
      stand: {
        id: null,
        nom: "",
        type: "",
        image: "",
        description: "",
        idPoint: null,
        comptes: [],
      },
      selectedTab: "",
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
    ...mapState("jeux", ["jeux"]),
    ...mapState("tournois", ["tournois"]),
    ...mapState("points", ["points"]),
    ...mapState("user", ["comptes", "actualUser"]),

    availablePoints() {
      return this.points
          .filter(point => {
            // Validation des coordonnées
            if (!point.coordonnees_x || !point.coordonnees_y ||
                isNaN(point.coordonnees_x) || isNaN(point.coordonnees_y)) {
              return false;
            }

            // Conversion explicite en Number
            const x = Number(point.coordonnees_x);
            const y = Number(point.coordonnees_y);

            // Vérification des plages de coordonnées réalistes pour Parthenay
            if (x < -0.28 || x > -0.23 || y < 46.62 || y > 46.68) {
              console.warn('Coordonnées invalides pour le point:', point);
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
      return this.jeuxCreation || [];
    },
    safePoints() {
      return this.availablePoints || [];
    },
    userRole() {
      console.log("User session:", JSON.stringify(this.actualUser));
      return this.actualUser?.role || '';
    },
    restaurant() {
      return []
      // return this.restaurantByUser(this.userSession?.id);
    },
    uniqueArticles() {
      return []
      // const allArticles = [];
      // this.allStands.forEach((stand) => {
      //   if (stand.nourritures) {
      //     allArticles.push(
      //       ...stand.nourritures.map((item) => ({ ...item, type: "Nourriture" })))
      //   }
      //   if (stand.boissons) {
      //     allArticles.push(
      //       ...stand.boissons.map((item) => ({ ...item, type: "Boisson" })))
      //   }
      // });
      // return [...new Map(allArticles.map(item => [item.nom, item])).values()];
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
          articles.push(...stand.nourritures.map(item => ({ ...item, type: 'Nourriture' })));
        }
        if (stand.boissons) {
          articles.push(...stand.boissons.map(item => ({ ...item, type: 'Boisson' })));
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
    await this.$store.dispatch("points/getAllPoints")
    // try {
    //   // await this.initializeData();
    //   // await this.loadJeuxCreation();
    //
    //   if (this.userSession && this.userSession.id) {
    //     // Charger le stand existant de l'utilisateur
    //     const userStand = this.$store.getters['restaurants/standByUser'](this.userSession.id);
    //     if (userStand) {
    //       this.stand = {
    //         ...userStand,
    //         id: userStand.id,
    //         nom: userStand.nom,
    //         description: userStand.description || "",
    //         image: userStand.image || "",
    //         idPoint: userStand.idPoint
    //       };
    //       this.isNewStand = false;
    //
    //       // Trouver le point sélectionné
    //       // this.selectedPoint = this.availablePoints.find(p => p.idPoint === userStand.idPoint);
    //       // this.originalPointId = userStand.idPoint;
    //     }
    //
    //     this.initializeStand();
    //     this.initializeTabs();
    //   }
    // } catch (error) {
    //   console.error("Initialization error:", error);
    // }
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

    confirmCreation() {
      // Logique de création de jeu
      this.closeConfirmation();
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
      if (!point.reserve && point.reserve !== undefined) {
        this.$toast.warning("Cet emplacement est déjà occupé");
        return;
      }

      this.selectedPoint = point;
      this.stand.idPoint = point.id;

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
        return L.divIcon({ className: 'custom-marker' });
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
  this.showSuccessMessage = false; // Réinitialiser

  try {
    // Validation
    if (!this.stand.nom || !this.stand.description) {
      throw new Error("Veuillez remplir tous les champs obligatoires");
    }

    if (!this.selectedPoint) {
      throw new Error("Veuillez sélectionner un emplacement sur la carte");
    }

    const standToSave = {
      ...this.stand,
      id: this.isNewStand ? `stand-${Date.now()}` : this.stand.id,
      idPoint: this.selectedPoint.id,
      comptes: [this.actualUser.id],
      type: this.getStandType()
    };

    console.log("Envoi au store:", standToSave); // Debug

    // Appel au store
    await this.$store.dispatch('restaurants/saveStand', standToSave);

    // Mise à jour des points
    if (this.originalPointId) {
      await this.$store.dispatch('points/updatePointAvailability', {
        pointId: this.originalPointId,
        isAvailable: true
      });
    }

    await this.$store.dispatch('points/updatePointAvailability', {
      pointId: this.stand.idPoint,
      isAvailable: false
    });

    // Feedback utilisateur
    this.isNewStand = false;
    this.originalPointId = this.stand.idPoint;
    this.showSuccessMessage = true;
    this.$toast.success("Stand enregistré avec succès !");

    // Recharger les données après un délai
    setTimeout(async () => {
      await this.initializeData();
      this.showSuccessMessage = false;
    }, 2000);

  } catch (error) {
    console.error("Erreur:", error); // Debug
    this.$toast.error(error.message || "Erreur lors de l'enregistrement");
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
          // Si c'est un fichier, convertis-le en URL
          imageUrl = URL.createObjectURL(this.newTournoi.image);
        } else if (typeof this.newTournoi.image === 'string') {
          // Si c'est déjà une URL (édition)
          imageUrl = this.newTournoi.image;
        } else {
          // Image par défaut
          imageUrl = require('@/assets/images/default-tournoi.png');
        }

        const tournoiData = {
          nom: this.newTournoi.nom,
          lieu: this.newTournoi.lieu,
          prix: Number(this.newTournoi.prix),
          image: imageUrl,
          description: this.newTournoi.description,
          prestataireId: this.actualUser.id,
          dates: this.newTournoi.dates.map(date => ({
            jour: Number(date.jour),
            mois: Number(date.mois),
            annee: Number(date.annee),
            heures: Number(date.heures),
            min: Number(date.min),
            placesRestantes: Number(date.placesRestantes)
          }))
        };

        await this.$store.dispatch('tournois/addTournoi', tournoiData);

        this.$toast.success("Tournoi créé avec succès !");
        this.closeTournoiModal();

        // Réinitialisation
        this.newTournoi = {
          nom: '',
          lieu: '',
          prix: 0,
          image: null,
          description: '',
          dates: []
        };

        await this.$store.dispatch('tournois/fetchTournois');

      } catch (error) {
        console.error("Erreur création tournoi:", error);
        this.$toast.error("Erreur lors de la création du tournoi");
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
      if (!this.newTournoi.nom) {
        this.$toast.warning("Veuillez entrer un nom pour le tournoi");
        return false;
      }

      if (this.newTournoi.dates.length === 0) {
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