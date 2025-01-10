<template>
  <div class="page-prestation">
    <h1 class="page-title">Gestion de ma prestation</h1>
    <div class="tab-container">
      <button v-if="isTabVisible('Catalogue')" :class="{ active: selectedTab === 'Catalogue' }" @click="selectTab('Catalogue')">Catalogue</button>
      <button v-if="isTabVisible('Jeux')" :class="{ active: selectedTab === 'Jeux' }" @click="selectTab('Jeux')">Mes jeux</button>
      <button v-if="isTabVisible('Emplacement')" :class="{ active: selectedTab === 'Emplacement' }" @click="selectTab('Emplacement')">Mon emplacement</button>
      <button v-if="isTabVisible('MesTournois')" :class="{ active: selectedTab === 'MesTournois' }" @click="selectTab('MesTournois')">Mes tournois</button>
      <button v-if="isTabVisible('MonRestaurant')" :class="{ active: selectedTab === 'MonRestaurant' }" @click="selectTab('MonRestaurant')">Mon restaurant</button>
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
    <!-- Onglet des jeux du flip -->
    <div v-show="selectedTab === 'Catalogue'">
      <div class="cards-container" v-if="jeux.length">
        <div v-for="jeu in jeux" :key="jeu.name" class="card" @click="openJeuModal(jeu)">
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
      <div class="cards-container" v-if="jeuxCreation.length">
        <div v-for="jeu in jeuxCreation" :key="jeu.name" class="card" @click="openJeuModal(jeu)">
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
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
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
      stands,
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
    ...mapGetters(["userSession", "restaurantByUser"]),
    userRole() {
    return this.$store.state.userSession.role; // Supposant que le rôle est stocké ici
  },
    uniqueArticles() {
      const allArticles = [];
      // Collect all articles from all stands
      this.stands.forEach((stand) => {
        if (stand.nourritures) {
          allArticles.push(
            ...stand.nourritures.map((item) => ({ ...item, type: "Nourriture" }))
          );
        }
        if (stand.boissons) {
          allArticles.push(
            ...stand.boissons.map((item) => ({ ...item, type: "Boisson" }))
          );
        }
      });
      // Filter unique articles by their name
      const uniqueMap = new Map();
      allArticles.forEach((article) => {
        if (!uniqueMap.has(article.nom)) {
          uniqueMap.set(article.nom, article);
        }
      });
      return Array.from(uniqueMap.values());
    },
    restaurantArticles() {
      // Get articles (nourritures and boissons) of the current restaurant
      const restaurant = this.stands.find((stand) =>
        stand.comptes.includes(this.$store.state.userSession.id)
      );
      if (restaurant) {
        const nourritures = restaurant.nourritures || [];
        const boissons = restaurant.boissons || [];
        return [...nourritures, ...boissons].map((item) => item.nom);
      }
      return [];
    },
    allArticles() {
      const restaurants = this.$store.state.restaurants; // Récupère tous les restaurants du store
      const articles = [];
      restaurants.forEach((restaurant) => {
        // Ajoute les nourritures
        if (restaurant.nourritures) {
          restaurant.nourritures.forEach((nourriture) => {
            articles.push({
              ...nourriture,
              type: 'Nourriture',
            });
          });
        }
        // Ajoute les boissons
        if (restaurant.boissons) {
          restaurant.boissons.forEach((boisson) => {
            articles.push({
              ...boisson,
              type: 'Boisson',
            });
          });
        }
      });
      return articles;
    },
    restaurant() {
      if (!this.userSession) return null;
      return this.$store.state.restaurants.find((restaurant) =>
        restaurant.comptes.includes(this.userSession.id)
      );
    },
    availablePoints() {
      return points.filter(point =>
        point.category === "Emplacement" &&
        (point.disponible || point.idPoint === this.originalPointId)
      );
    },
    mesTournois() {
      return this.$store.state.tournois.filter(
        (tournoi) => tournoi.prestataireId === this.$store.state.userSession.id
      );
    },
  },
  created() {
    this.$store.dispatch("initializeRestaurants");
  },
  methods: {
    isTabVisible(tab) {
  const role = this.userSession.role; // Supposant que le rôle de l'utilisateur est stocké ici
  const tabPermissions = {
    Catalogue: ["vendeur", "createur"],
    Jeux: ["vendeur", "createur"],
    Emplacement: ["vendeur", "createur", "restaurateur", "organisateur"],
    MesTournois: ["organisateur"],
    MonRestaurant: ["restaurateur"],
  };
  return tabPermissions[tab]?.includes(role);
},
    toggleArticleInRestaurant(article) {
      if (!this.restaurant) {
        alert("Veuillez créer un restaurant avant d'ajouter ou supprimer des articles.");
        return;
      }

      const listKey = article.type === "Nourriture" ? "nourritures" : "boissons";
      const articleIndex = this.restaurant[listKey].findIndex(
        (item) => item.nom === article.nom
      );

      if (articleIndex !== -1) {
        // Supprimer l'article
        this.restaurant[listKey].splice(articleIndex, 1);
        alert(`L'article "${article.nom}" a été supprimé de votre restaurant.`);
      } else {
        // Ajouter l'article
        this.restaurant[listKey].push(article);
        alert(`L'article "${article.nom}" a été ajouté à votre restaurant.`);
      }

      // Utilisez Vue.set pour garantir la réactivité
      this.$set(this.restaurant, listKey, [...this.restaurant[listKey]]);

      // Mettre à jour le store et localStorage
      this.$store.commit("UPDATE_RESTAURANT", this.restaurant);
      this.saveRestaurantToLocalStorage();
    },
    isRestaurantArticle(article) {
      const listKey = article.type === "Nourriture" ? "nourritures" : "boissons";
      return this.restaurant[listKey]?.some((item) => item.nom === article.nom) || false;
    },
    openEditRestaurantModal() {
      this.showEditRestaurantModal = true;
      this.editRestaurantDetails.nom = this.restaurant.nom;
      this.editRestaurantDetails.image = this.restaurant.image;
    },
    closeEditRestaurantModal() {
      this.showEditRestaurantModal = false;
    },
    saveEditedRestaurant() {
      if (!this.editRestaurantDetails.nom || !this.editRestaurantDetails.image) {
        alert('Veuillez remplir tous les champs.');
        return;
      }
      const updatedRestaurant = {
        ...this.restaurant,
        nom: this.editRestaurantDetails.nom,
        image: this.editRestaurantDetails.image,
      };
      this.$store.dispatch("updateRestaurant", updatedRestaurant);
      this.closeEditRestaurantModal();
      alert('Restaurant modifié avec succès !');
    },
    handleEditRestaurantImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editRestaurantDetails.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    testCreation() {
      console.log("Création de restaurant déclenchée");
    },
    ...mapActions(['createRestaurant']),
    createRestaurant({ commit, state }, restaurantData) {
      console.log("Création d'un restaurant dans le store avec : ", restaurantData);
      const newRestaurant = {
        ...restaurantData,
        id: Date.now(), // Génère un ID unique
        idRestau: `R${Math.floor(Math.random() * 1000)}`, // Génère un ID restaurant
        type: "restaurants", // Définit le type comme "restaurant"
        comptes: [state.userSession.id], // Lie l'utilisateur connecté au restaurant
        nourritures: [], // Initialise les nourritures vides
        boissons: [], // Initialise les boissons vides
        notes: [], // Initialise les notes vides
        commentaires: [], // Initialise les commentaires vides
      };
      // Ajout au store (mutation)
      commit("ADD_RESTAURANT", newRestaurant);
      // Enregistrement dans le fichier local
      this.dispatch("saveRestaurantToLocalFile", newRestaurant);
      console.log("Restaurant créé :", newRestaurant);
    },
    updateRestaurant() {
      this.$store.dispatch('updateRestaurant', this.restaurant);
    },
    handleNewRestaurantImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newRestaurantImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    handleCreateRestaurant() {
      if (!this.newRestaurantName || !this.newRestaurantImage || !this.selectedPoint) {
        alert("Veuillez remplir tous les champs et sélectionner un point sur la carte.");
        return;
      }
      const newRestaurant = {
        id: Date.now(), // Génère un ID unique pour le stand
        idRestau: `R-${Date.now()}`, // Génère un ID unique pour le restaurant
        nom: this.newRestaurantName,
        type: "restaurants",
        image: this.newRestaurantImage,
        idPoint: this.selectedPoint.idPoint, // Numéro du point sélectionné sur la carte
        comptes: [this.$store.state.userSession.id], // ID du prestataire connecté
        nourritures: [], // Liste vide à l'initialisation
        boissons: [], // Liste vide à l'initialisation
        notes: [], // Liste vide à l'initialisation
        commentaires: [], // Liste vide à l'initialisation
      };
      this.$store.dispatch("addRestaurant", newRestaurant);
      this.newRestaurantName = "";
      this.newRestaurantImage = "";
      this.selectedPoint = null;
      alert("Restaurant créé avec succès !");
    },
    openTournoiModal() {
      this.showTournoiModal = true;
    },
    closeTournoiModal() {
      this.showTournoiModal = false;
      this.resetNewTournoi();
    },
    handleTournoiImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newTournoi.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    addDate() {
      this.newTournoi.dates.push({
        jour: null,
        mois: null,
        annee: null,
        heures: null,
        min: null,
        placesRestantes: null,
      });
    },
    removeDate(index) {
      this.newTournoi.dates.splice(index, 1);
    },
    resetNewTournoi() {
      this.newTournoi = {
        nom: '',
        lieu: '',
        prix: 0,
        image: null,
        description: '',
        dates: [],
      };
    },
    createTournoi() {
      if (!this.newTournoi.nom || !this.newTournoi.lieu || !this.newTournoi.prix) {
  alert("Veuillez remplir tous les champs obligatoires.");
  return;
}
      if (!this.newTournoi.dates.length) {
        alert("Veuillez ajouter au moins une date.");
        return;
      }
      for (const date of this.newTournoi.dates) {
        if (!date.placesRestantes || date.placesRestantes < 1) {
          alert("Veuillez entrer un nombre de places valide pour chaque date.");
          return;
        }
      }
      const tournoi = {
        ...this.newTournoi,
        _id: Date.now().toString(),
        prestataireId: this.$store.state.userSession.id, // Lien avec le prestataire
      };
      // Ajouter le tournoi dans le store
      this.$store.commit('ADD_TOURNOI', tournoi);
      // Réinitialiser le formulaire et fermer le modal
      this.closeTournoiModal();
    },
    formatDate(date) {
      return `${date.jour}/${date.mois}/${date.annee} ${date.heures}h${date.min}`;
    },
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
    confirmCreation() {
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
      alert(`Point sélectionné : ${point.idPoint}`);
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
  /* Vert clair */
}

.article-other {
  background-color: #f0f0f0;
  /* Gris clair */
}

.add-button {
  background-color: #4caf50;
  /* Vert */
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
  /* Rouge */
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
</style>