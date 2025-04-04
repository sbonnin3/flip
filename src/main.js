import './leaflet-fix'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import { defineCustomElements } from '@ionic/pwa-elements/loader'

defineCustomElements(window)

async function init() {
  await store.dispatch('user/checkSession')

  new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app')
}

init()

Vue.config.productionTip = false