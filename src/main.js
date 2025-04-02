import './leaflet-fix'; // Ajoutez cette ligne
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import i18n from './i18n'

import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
