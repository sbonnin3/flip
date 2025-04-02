<template>
  <div class="commandes-page">
    <div class="page-header">
      <h1>Commandes de la boutique</h1>
      <div class="header-actions">
        <button class="refresh-btn" @click="refreshData">
          <i class="fas fa-sync-alt"></i> Actualiser
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des commandes...</p>
    </div>

    <div v-else>
      <div v-if="commandesJeu.length === 0" class="empty-state">
        <i class="fas fa-box-open"></i>
        <h3>Aucune commande pour le moment</h3>
        <p>Les commandes apparaîtront ici lorsqu'elles seront passées</p>
      </div>

      <div v-else class="commandes-grid">
        <div v-for="commande in commandesJeu" :key="commande.orderNumber || commande.reservationJeuId"
          class="commande-card">
          <div class="card-header">
            <div class="commande-info">
              <h3>Commande #{{ commande.orderNumber || commande.reservationJeuId }}</h3>
            </div>
          </div>

          <div class="client-info">
            <i class="fas fa-user"></i>
            <span>{{ getClientName(commande.userId) }}</span>
          </div>

          <div class="articles-list">
            <div v-for="(article, index) in commande.articles" :key="index" class="article-item">
              <div class="article-image-container">
                <img v-if="article.jeuData?.image" :src="article.jeuData.image" :alt="article.nom"
                  class="article-image">
                <div v-else class="article-image-placeholder">
                  <i class="fas fa-gamepad"></i>
                </div>
              </div>
              <div class="article-details">
                <h4 class="article-name">{{ article.jeuData?.name || article.nom }}</h4>
                <div class="article-meta">
                  <span class="article-type">{{ article.jeuData?.type }}</span>
                  <span class="article-editeur">{{ article.jeuData?.editeur }}</span>
                </div>
                <div class="article-quantity-price">
                  <span class="article-quantity">x{{ article.quantite || 1 }}</span>
                  <span class="article-price">{{ article.prix }}€</span>
                </div>
              </div>
            </div>
          </div>

          <div class="commande-footer">
            <div class="total-amount">
              <span>Total :</span>
              <span class="total-price">{{ calculateTotal(commande) }}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PageCommandesBoutique",
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    ...mapGetters('commandes', ['boutiqueOrders']),
    ...mapGetters('user', ['comptes']),
    ...mapGetters('jeux', ['allJeux']),

    commandesJeu() {
      // Filtre supplémentaire pour ne garder que les commandes avec des articles de jeux
      return (this.boutiqueOrders || []).filter(commande => {
        // Vérifie si au moins un article est un jeu (a un jeuID ou id correspondant à un jeu)
        if (!commande.articles) return false;
        return commande.articles.some(article => {
          return this.allJeux.some(jeu => jeu._id === article.id);
        });
      }).map(commande => {
        // Mappage des données des jeux
        if (commande.articles) {
          const articlesWithJeuData = commande.articles.map(article => {
            const jeu = this.allJeux.find(j => j._id === article.id);
            return {
              ...article,
              jeuData: jeu || null
            };
          });
          return {
            ...commande,
            articles: articlesWithJeuData
          };
        }
        return commande;
      });
    }
  },
  methods: {
    getClientName(userId) {
      const user = this.comptes?.find(u => u.id === userId);
      return user ? `${user.prenom} ${user.nom}` : `Client #${userId}`;
    },
    formatDate(dateString) {
      if (!dateString) return 'Date inconnue';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    calculateTotal(commande) {
      if (!commande.articles) return 0;
      return commande.articles.reduce((total, article) => {
        return total + (article.prix * (article.quantite || 1));
      }, 0);
    },
    getStatusClass(status) {
      const statusMap = {
        'Confirmée': 'confirmed',
        'Expédiée': 'shipped',
        'Annulée': 'cancelled',
        'En traitement': 'processing'
      };
      return statusMap[status] || 'confirmed';
    },
    async refreshData() {
      this.isLoading = true;
      try {
        await this.$store.dispatch('jeux/getAllJeux');
        await this.$store.dispatch('commandes/initReservationsJeux');
      } catch (error) {
        console.error("Erreur lors du rafraîchissement:", error);
      } finally {
        this.isLoading = false;
      }
    },
    showDetails(commande) {
      // Implémentez la logique pour afficher les détails
      console.log("Détails de la commande:", commande);
    }
  },
  async mounted() {
    try {
      // Charge d'abord les jeux
      await this.$store.dispatch('jeux/getAllJeux');

      // Charge seulement les réservations de jeux
      await this.$store.dispatch('commandes/initReservationsJeux');

    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/* Ajoutez ces styles supplémentaires */
.article-type {
  font-size: 0.85rem;
  color: #3498db;
  background-color: #eaf2f8;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-right: 0.5rem;
}

.article-editeur {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.article-quantity-price {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.article-quantity {
  color: #7f8c8d;
}

.article-price {
  font-weight: 500;
  color: #27ae60;
}

.commandes-page {
  font-family: 'Roboto', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #333;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eaeaea;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.refresh-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
}

.refresh-btn:hover {
  background-color: #2980b9;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #bdc3c7;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.commandes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.commande-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.commande-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
}

.commande-info h3 {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #2c3e50;
}

.commande-date {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.confirmed {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.shipped {
  background-color: #cce5ff;
  color: #004085;
}

.status-badge.cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge.processing {
  background-color: #fff3cd;
  color: #856404;
}

.client-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid #f1f1f1;
}

.client-info i {
  color: #7f8c8d;
}

.articles-list {
  padding: 0.5rem;
}

.article-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  gap: 1rem;
  border-bottom: 1px solid #f5f5f5;
}

.article-item:last-child {
  border-bottom: none;
}

.article-image-container {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.article-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.article-image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f1f1f1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bdc3c7;
  font-size: 1.5rem;
}

.article-details {
  flex-grow: 1;
}

.article-name {
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #2c3e50;
}

.article-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.article-price {
  font-weight: 500;
  color: #27ae60;
}

.commande-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #eaeaea;
}

.total-amount {
  font-weight: 500;
}

.total-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-left: 0.5rem;
}

.action-btn {
  background-color: #f8f9fa;
  color: #3498db;
  border: 1px solid #3498db;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: #3498db;
  color: white;
}

@media (max-width: 768px) {
  .commandes-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>