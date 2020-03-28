import KRouterLink from './KRouterLink.js'
import KRouterView from './KRouterView.js';

// 声明一个变量来接收install方法中收到的Vue构造函数
let Vue

// new KVueRouter的时候会调用constructor方法
class KVueRouter {
  constructor(options) {
    // options就是配置的路由信息，将它作为KVueRouter对象的一个属性
    this.$options = options
    // 创建一个响应式数据，来存储当前的路由信息，在KRouterView组件中可以直接用这个变量
    // defineReactive()方法是vue创建响应式数据的方法，这里是在KVueRouter对象上面创建一个名为current的响应式属性，初始值是'/'


    // Vue.util.defineReactive(this, 'current', '/') 如果是嵌套路由，当前的current就不能匹配到每个场景了，则不需要响应式
    this.current = window.location.hash.slice(1) || '/'
    // 嵌套路由的情况下，需要一个数组来保存当前路由的层级，并且需要时响应式的数据，一遍routerview中使用
    Vue.util.defineReactive(this, 'match', [])
    // 使用递归，遍历当前的路由，并存到this.match中去
    this.matchRouter()

    // 使用hashchange事件来监听当前路由的变化，它监听的是当前连接的锚部分（就是 # 后面的）的变化
    // 使用bind方法防止this指向发生变化
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))

    // 生成一个map，方便view组件获取当前路由对应的组件
    this.routerMap = {}
    this.$options.router1.forEach(route => {
      this.routerMap[route.path] = route.component
    })
  }
  onHashChange () {
    // window.location.hash就是url中锚部分，但是它以# 开头，需要把#去掉
    this.current = window.location.hash.slice(1)
    this.match = []
    this.matchRouter()
  }
  matchRouter (routes) {
    // 由于是递归，所以需要接收递归是传入的参数，第一次直接取所有的路由表
    routes = routes || this.$options.router1
    for (const route of routes) {
      // 如果是首页，直接将route push到match数组里面去
      if (route.path === '/' && this.current === '/') {
        this.match.push(route)
        return
      }
      if (route.path !== '/' && this.current.indexOf(route.path) !== -1) {
        this.match.push(route)
        if (route.children) {
          this.matchRouter(route.children)
        }
        return
      }
    }
  }
}

// 实现Vue.use()需要的install方法
// Vue.use()方法会把Vue作为参数传到install方法中来
KVueRouter.install = function (_vue) {
  Vue = _vue
  // 此时收到的Vue是个构造函数，并不是根实例，这里需要把根实例中的router选项挂载到Vue原型链上,这样每个组件都可以通过this.$router来访问router
  // 只能利用全局混入，在beforeCreate()这个声明周期钩子中获取router选项
  Vue.mixin({
    // beforeCreate钩子在每个组件实例化的时候去执行，但是router选项只在根实例中有，所以要判断一下
    beforeCreate () {
      // 这里this指向当前正在实例化的组件,this.$options是组件的初始化选项
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })

  // 再声明两个全局组件，link和view
  Vue.component('k-router-link', KRouterLink)
  Vue.component('k-router-view', KRouterView)
}

export default KVueRouter