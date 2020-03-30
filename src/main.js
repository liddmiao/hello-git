import Vue from 'vue'
import App from './App.vue'
import { create } from '@/utils/create.js'
// import router from './krouter/index.js'
import store from './kvuex/index.js'
import router from './kvuerouter/index.js'

Vue.prototype.$create = create
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
