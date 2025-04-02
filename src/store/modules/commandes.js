export default {
    namespaced: true,
    state: {
        userOrders: [],
        currentOrder: [],
        allOrders: [],
        reservationsJeux: [],
        prestataireOrders: []
    },
    mutations: {
        SET_USER_ORDERS(state, orders) {
            state.userOrders = orders;
        },
        SET_CURRENT_ORDER(state, order) {
            state.currentOrder = order;
        },
        RESET_CURRENT_ORDER(state) {
            state.currentOrder = [];
        },
        SET_ALL_ORDERS(state, orders) {
            state.allOrders = orders;
        },
        SET_RESERVATIONS_JEUX(state, reservations) {
            state.reservationsJeux = reservations;
        },
        ADD_BOUTIQUE_ORDER(state, order) {
            state.allOrders.push(order);
            if (state.userOrders.some(o => o.userId === order.userId)) {
                state.userOrders.push(order);
            }
        },
        SET_PRESTATAIRE_ORDERS(state, orders) {
            state.prestataireOrders = orders;
        }
    },
    actions: {
        async fetchBoutiqueOrders({ commit, rootState }) {
            try {
                // Charge les données locales si elles existent
                const { commandes } = await import("@/datasource/data");
                const boutiqueOrders = commandes.filter(order => order.type === 'boutique');
                
                // Charge les jeux pour avoir les noms complets
                const jeux = rootState.jeux.allJeux || [];
                
                // Formate pour l'affichage prestataire
                const formattedOrders = boutiqueOrders.map(order => {
                    const articlesWithNames = order.articles.map(article => {
                        const jeu = jeux.find(j => j._id === article.id);
                        return {
                            ...article,
                            nom: jeu?.name || article.nom
                        };
                    });
                    
                    return {
                        ...order,
                        articles: articlesWithNames
                    };
                });
                
                commit('SET_PRESTATAIRE_ORDERS', formattedOrders);
                commit('SET_ALL_ORDERS', [...formattedOrders]);
                return formattedOrders;
            } catch (error) {
                console.error("Erreur chargement commandes boutique:", error);
                commit('SET_PRESTATAIRE_ORDERS', []);
                return [];
            }
        },
        async initReservationsJeux({ commit, rootState }) {
            try {
              const { reservationsJeux } = await import("@/datasource/reservationsJeux");
              const jeux = rootState.jeux.allJeux || [];
              
              const formattedReservations = reservationsJeux.map(reservation => {
                const jeu = jeux.find(j => j._id === reservation.jeuID);
                return {
                  ...reservation,
                  type: 'boutique',
                  status: reservation.status || 'Confirmée',
                  articles: [{
                    id: reservation.jeuID,
                    nom: jeu?.name || 'Jeu ' + reservation.jeuID,
                    prix: Number(reservation.prix),
                    quantite: 1,
                    image: jeu?.image || '',
                    jeuData: jeu // On ajoute toutes les données du jeu
                  }]
                };
              });
              
              commit('SET_RESERVATIONS_JEUX', formattedReservations);
              commit('SET_ALL_ORDERS', [...rootState.commandes.allOrders, ...formattedReservations]);
              return formattedReservations;
            } catch (error) {
              console.error("Erreur chargement réservations jeux:", error);
              commit('SET_RESERVATIONS_JEUX', []);
              return [];
            }
          },
          getNomJeu(rootState, jeuID) {
            const jeu = rootState.jeux.jeux.find(j => j._id === jeuID);
            return jeu ? jeu.name : 'Jeu ' + jeuID;
          },
          
          getImageJeu(rootState, jeuID) {
            const jeu = rootState.jeux.jeux.find(j => j._id === jeuID);
            return jeu ? jeu.image : '';
          },

        addArticleOrder({ commit, state }, order) {
            if (!order.orderNumber || !order.userId) {
                console.error("Commande invalide:", order);
                return;
            }

            const orderType = order.type || 'boutique';
            const completeOrder = {
                ...order,
                type: orderType,
                date: new Date().toISOString(),
                status: order.status || 'Confirmée'
            };

            if (orderType === 'boutique') {
                commit('ADD_BOUTIQUE_ORDER', completeOrder);
            } else {
                const userOrders = [
                    ...state.userOrders.filter(o => o.orderNumber !== order.orderNumber),
                    completeOrder
                ];

                const allOrders = [
                    ...state.allOrders.filter(o => o.orderNumber !== order.orderNumber),
                    completeOrder
                ];

                commit('SET_USER_ORDERS', userOrders);
                commit('SET_ALL_ORDERS', allOrders);
            }
        },

        setCurrentOrder({ commit }, orders) {
            if (!Array.isArray(orders)) {
                console.error("setCurrentOrder attend un tableau");
                return;
            }
            commit('SET_CURRENT_ORDER', orders);
            orders.forEach(order => this.dispatch('commandes/addArticleOrder', order));
        },

        resetCurrentOrder({ commit }) {
            commit('RESET_CURRENT_ORDER');
        },

        async initOrders({ commit }) {
            try {
                const { commandes } = await import("@/datasource/data");
                commit('SET_ALL_ORDERS', commandes);
            } catch (error) {
                console.error("Erreur chargement commandes:", error);
                commit('SET_ALL_ORDERS', []);
            }
        },

        async loadUserOrders({ commit, rootState, state }) {
            const userId = rootState.user.userSession?.id;
            if (!userId) {
                console.warn("Aucun userId - impossible de charger les commandes");
                return;
            }

            const userOrders = state.allOrders.filter(order => 
                order.userId === userId
            );
            commit('SET_USER_ORDERS', userOrders);
        }
    },
    getters: {
        userOrders: state => state.userOrders || [],
        currentOrder: state => state.currentOrder || [],
        allOrders: state => state.allOrders || [],
        reservationsJeux: state => state.reservationsJeux || [],
        prestataireBoutiqueOrders: state => state.prestataireOrders || [],
        boutiqueOrders: state => {
            // Combine les commandes boutique et les réservations de jeux
            return [
                ...(state.prestataireOrders || []),
                ...(state.reservationsJeux || [])
            ];
        },
        restaurationOrders: state => state.allOrders.filter(order => order.type === 'restauration')
    }
};