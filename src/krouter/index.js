import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'
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
    component: () => import('@/components/About.vue')
  }
]

export default new KRouter({
  router
})
