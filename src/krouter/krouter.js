import RouterLink from './KLink'
import RouterView from './KView'
// 用来保存install接收到的vue
let Vue

class KRouter {
  constructor(options) {
    // 保存options
    this.$options = options
    // 创建一个相应是的current，通过hashchange监听到路由变化后改变这个值
    // vue.util.defineReactive(),vue隐藏的一个工具，用于创建响应式数据
    Vue.util.defineReactive(this, 'current', '/')
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))
    // 添加一个routerMap，方便获取
    this.routeMap = {}
    this.$options.router.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }
  onHashChange () {
    this.current = window.location.hash.slice(1)
  }
}

KRouter.install = function (_vue) {
  Vue = _vue
  // 这里需要将router挂载到vue原型链上去
  // 这里使用beforeCreate钩子来获取选项，并挂载到vue原型链上
  // 使用一个全局的混入，router只有根实例上面有
  Vue.mixin({
    beforeCreate () {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })

  Vue.component('router-link', RouterLink)
  Vue.component('router-view', RouterView)
}

export default KRouter
