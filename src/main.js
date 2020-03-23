import Vue from 'vue'
import App from './App.vue'
import { create } from '@/utils/create.js';

Vue.prototype.$create = create
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
