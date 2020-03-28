import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'
import About from '@/components/About.vue'
import KVueRouter from './KVueRouter'

// use方法安装KVueRouter插件，如果KVueRouter是个对象，需要实现一个install方法
Vue.use(KVueRouter)

// 配置路由选项
const router1 = [
  {
    path: '/',
    name: 'home',
    component: HelloWorld
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    children: [
      {
        path: '/about/info',
        component: {
          render (h) {
            return h('div', 'info page')
          }
        }
      }
    ]
  }
]

export default new KVueRouter({
  router1
})