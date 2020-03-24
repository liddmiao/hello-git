import Vue from 'vue'
import App from './App.vue'
import { create } from '@/utils/create.js'
import router from './krouter/index.js'

Vue.prototype.$create = create
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
