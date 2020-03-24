import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'
import About from '@/components/About.vue'
import KRouter from './krouter.js'

Vue.use(KRouter)

const router = [
  {
    path: '/',
    name: 'home',
    component: HelloWorld
  },
  {
    path: '/about',
    name: 'about',
    component: About
  }
]

export default new KRouter({
  router
})
