const state = {
    cart: []
  };
  
  const mutations = {
    ADD_TO_CART(state, article) {
      const itemInCart = state.cart.find(item => item.nom === article.nom);
      if (itemInCart) {
        itemInCart.quantite += 1;
      } else {
        state.cart.push({ ...article, quantite: 1 });
      }
    }
  };
  
  const actions = {
    addToCart({ commit }, article) {
      commit('ADD_TO_CART', article);
    }
  };
  
  const getters = {
    cartItems: state => state.cart
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  };