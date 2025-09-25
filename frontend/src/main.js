import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { router } from './routes/index.js'
import { store } from './store/index.js'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  vuetify,
  router,
  store,
}).$mount('#app')
