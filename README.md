# helloworld

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

# 2020.03.20

## 解决$parent和$children 的耦合问题

阅读 element ui 的源码，element ui 使用混入，通过 componentName 动态地寻找父元素和子元素，实现了解耦

```JavaScript
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName
    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params))
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]))
    }
  })
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root
      var name = parent.$options.componentName

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.componentName
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    }
  }
}
```

call()、apply()、bind():都可以用来改变 this 的指向

call()和 apply()方法传参方式和不同，apply()的参数需要是一个数组

bind()参数和 call()一样，但是它返回一个函数

```JavaScript
var name = "json"
var age = 20
var obj = {
    name: "java",
    ages: this.age,
    fn: function(s){
        if (!s) {
           console.log(this.ages)
        } else {
            console.log(this.ages + '' + s.name)
        }
    }
}
var obj1 = {
    name: "PHP",
    ages: 10
}


obj.fn() //20 this永远指向最后调用它的那个对象
obj.fn(obj1) //20PHP
obj.fn.call(obj1,obj1) //10PHP call改变了指向，this指向obj1
obj.fn.apply(obj1,[obj1]) //10PHP apply也将this指向改变为obj1，但是参数是个数组
obj.fn.bind(obj1,obj1)() //10PHP bind成功改变了指向，但是返回的是个函数，需要主动调用一次
```

## Vue.extend()实现 create 方法

Vue.extend()是 vue 的一个全局 api，参数是一个包含组件选项的对象，返回一个构造方法，这个构造方法可以通过 propsData 属性传参

create.js

```javascript
import Vue from 'vue'
export function create(component, props) {
  // 通过Vue.extend得到一个构造函数
  const Ctor = Vue.extend(component)
  // 利用构造函数得到组件实例，并挂载
  const comp = new Ctor({ propsData: props })
  comp.$mount()
  document.body.appendChild(comp.$el)
  comp.remove = () => {
    document.body.removeChild(comp.$el)
    comp.$destroy()
  }
  return comp
}
```

将 create 方法添加到 vue 原型链上，便可以随时调用了

```javascript
import { create } from '@/utils/create.js'

Vue.prototype.$create = create
```

Vue.component()可以使用 Vue.extend()返回的构造函数来注册一个组件，并给这个组件命名

# 2020.03.24

## 手写一个简单的 vue-router

#### Vue插件开发

我们开发的插件需要实现一个install方法，它接收的第一个参数是Vue的构造器；通过全局方法 `Vue.use()` 使用插件。它需要在你调用 `new Vue()` 启动应用之前完成。

#### hash模式和history模式

在html5的history模式出现以前，前段路由的实现基本都是使用hash来实现的，它能兼容到IE8。hash指的是url中'#'号及其后面的字符，也称作锚点，可以使对应的元素显示在可视区域内。当hash值变化时，浏览器不会向服务器发出请求。监听hash的变化，可以使用hashchange事件。vue-router默认使用hash模式。

history模式在URL里面不会有一个'#'号，html5规范提供了history.pushState和history.replaceState来进行路由控制，也不会向服务器发送请求，它只能兼容到IE10。

#### 模仿vue-router插件

我们需要实现一个使用hash模式的路由插件，它要注册两个全局组件，k-router-link和k-router-view，并且能监听hash的变化，将对应的dom显示到页面上。

#### 代码实现

- 配置一个路由文件

  ```JavaScript
  import Vue from 'vue'
  import HelloWorld from '@/components/HelloWorld.vue'
  import About from '@/components/About.vue'
  // 导入我们实现的router组件
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
      component: About
    }
  ]
  
  export default new KVueRouter({
    router1
  })
  ```

- 在KVueRouter.js文件中，创建并导出一个KVueRouter类，实现install方法

  ```JavaScript
  import KRouterLink from './KRouterLink.js'
  import KRouterView from './KRouterView.js'
  
  // 声明一个变量来接收install方法中收到的Vue构造函数
  let Vue
  
  // new KVueRouter的时候会调用constructor方法
  class KVueRouter {
    constructor(options) {
      // options就是配置的路由信息，将它作为KVueRouter对象的一个属性
      this.$options = options
      // 创建一个响应式数据，来存储当前的路由信息，在KRouterView组件中可以直接用这个变量
      // defineReactive()方法是vue创建响应式数据的方法，这里是在KVueRouter对象上面创建一个名为current的响应式属性，初始值是'/'
  
       Vue.util.defineReactive(this, 'current', '/')
  
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
  ```

- 实现k-router-link组件

  ```JavaScript
  // 导出一个对象，这个对象是link组件的配置信息
  // 这里渲染一个<a href="/a/b"></a>
  // 这个组件从父组件接收一个to属性，来判断自己的地址
  export default {
    props: {
      to: {
        type: String,
        required: true
      }
    },
    // 使用render函数
    render (h) {
      // h其实是createElement(),它接受三个参数： 标签名称、属性集合、子元素数组
      // 我们使用前端hash路由模式来实现一个单页面应用，需要在接收到的路由字符串前边拼接一个'#'
      // this.$slots存放了插槽的内容
      return h('a', { attrs: { href: '#' + this.to } }, [this.$slots.default])
      // 这里还可以使用jsx语法,但是有使用的限制，vue-cli支持这种写法
      // return <a href={'#' + this.to}>{this.$slots.default}</a>
    }
  }
  ```

- 实现k-router-view组件

  ```
  // 这个组件就是获取当前路由对应的组件，拿到这个组件对象，并渲染到页面中
  export default {
    // 只有一层路由的情况
    render (h) {
      let component = null
      // 通过this.$router.routerMap获取创建的路由map，通过this.$router.current获取当前链接
      let route = this.$router.routerMap[this.$router.current]
      if (route) {
        component = route
      }
      return h(component)
    }
  }
  ```

#### 使用

  和使用router-view一样，我们在main.js中导入路由，并注入到根实例中，这样整个应用都拥有了路由功能

  main.js

  ```JavaScript
  import Vue from 'vue'
  import App from './App.vue'
  import router from './kvuerouter/index.js'
  
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
  ```

  App.vue

  ```vue
  <template>
    <div id="app">
      <k-router-link to="/">router home |</k-router-link>
      <k-router-link to="/about">router about</k-router-link>
      <k-router-view></k-router-view>
    </div>
  </template>
  ```

## Vue-router插件——嵌套路由

实际生活中的应用界面，通常由多层嵌套的组件组合而成。同样地，URL 中各段动态路径也按某种结构对应嵌套的各层组件，例如：

```JavaScript
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
```

这里的/about/info就是一个嵌套路由，要对这样的路由进行处理，我们在router-view中获取对应的组件对象时，就有一点不一样了。之前在KVueRouter类中，我们创建了一个响应式属性current来保存当前的hash，并创建了一个map来方便在KRouterView.js中获取对应的组件对象。这对于嵌套路由来说，就不能满足需求了。

我们重新创建一个响应式属性match，它是一个数组，同时，我们递归遍历已配置的路由对象，将每一级的路由信息都在这个数组中保存下来，此时，current就不需要是一个响应式数据了。

修改后的KVueRouter类

```JavaScript
class KVueRouter {
  constructor(options) {
    // options就是配置的路由信息，将它作为KVueRouter对象的一个属性
    this.$options = options
    // 创建一个响应式数据，来存储当前的路由信息，在KRouterView组件中可以直接用这个变量
    // defineReactive()方法是vue创建响应式数据的方法，这里是在KVueRouter对象上面创建一个名为current的响应式属性，初始值是'/'
      
    // 从这里开始不同  
      
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

    // 生成一个map，方便view组件获取当前路由对应的组件,处理嵌套路由就用不上了
    // this.routerMap = {}
    // this.$options.router1.forEach(route => {
    //   this.routerMap[route.path] = route.component
    // })
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
```

修改后的KRouterView.js

  ```javascript
  // 这个组件就是获取当前路由对应的组件，拿到这个组件对象，并渲染到页面中
  export default {
    // 处理嵌套路由
    render (h) {
      let component = null
      // this.$vnode是当前组件的虚拟dom，我们在它虚拟dom的data属性中设置一个自定义的属性，代表自己是一个routerview
      this.$vnode.data.routerView = true
      // 需要标记当前路由的深度，循环获取父组件，如果父组件的routerview为true，则代表自己的深度加1
      let deep = 0
      let parent = this.$parent
      while (parent) {
        const vnodeData = parent.$vnode && parent.$vnode.data
        if (vnodeData && vnodeData.routerView) {
          deep++
        }
        parent = parent.$parent
      }
      // 通过match数组获取当前的route
      const route = this.$router.match[deep]
      if (route) {
        component = route.component
      }
      return h(component)
    }
  }
  ```

  

## 手写一个简单的 vuex

#### 需求

Vuex 是一个帮助我们集中管理 vue 组件状态的状态管理插件，我们将模拟它的 state、mutation、action、getter。在组件内，我们可以通过 vm.$store.commit()来更改state，或者使用vm.$store.dispatch()来异步地改变 state，同时阻止用户通过 vm.$store.state=''这种方式直接改变state；用户可以使用$store.getters()来获取 state，当 state 改变时，获取的值也做相应的改变。

#### 实现

首先，我们创建一个简单的 Store

- index.js

```JavaScript
import Vue from 'vue'
import Vuex from './kstorevuex.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    SET_COUNT(state, value) {
      state.count = value
    }
  },
  actions: {
    ASYNC_COUNT(state, value) {
      setTimeout(() => {
        state.count = value
      }, 2000)
    }
  },
  getters: {
    GET_COUNT(state) {
      return state.count
    }
  }
})

```

和 vue-router 一样，我们要实现一个 Store 类和 install 方法，但是注意我们使用的时候是 new Vuex.Store，所以，KVuex 文件应该是这样的

- KVuex.js

```JavaScript
let Vue

class Store {
  constructor(options) {}
}
function install(_vue) {}
export default { Store, install }
```

同样的，我们要在 install 方法中将\$store 挂到 Vue 原型链上，方便组件来调用。

- function install

```JavaScript
function install(_vue) {
  // 这里和仿vue-router组件是一样的
  Vue = _vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}
```

在 class Store 中，我们要实现 getter、commit、dispatch 这三个方法；和仿 vue-router 不同的是，我们创建响应式数据的方式有所变化，值得注意的一点是利用 computed 选项实现 getter。

- class Store

```JavaScript
class Store {
  constructor(options) {
    // 将action和mutation存入this
    this._mutations = options.mutations
    this._actions = options.actions
    this._wrapGetters = options.getters
    this.getters = {}
    // 利用computed选项实现getter，避免this指向混乱，使用一个变量保存this
    const store = this
    let computed = {}
    // 遍历vuex的getter配置项
    Object.keys(store._wrapGetters).forEach(key => {
      const f = store._wrapGetters[key]
      // 由于computed里面的函数没有参数，所以这里稍微处理一下
      computed[key] = () => {
        return f(store.state)
      }
      // 设置store.getter只读
      Object.defineProperty(store.getters, key, {
        get: () => {
          return store._vm[key]
        }
      })
    })
    // 创建一个响应式的$$state属性，不使用defineReactive()方法是因为实现getter方法需要使用computed选项，state前面加两个$可以不让vue自动代理$$state
    this._vm = new Vue({
      data: {
        $$state: options.state
      },
      computed
    })

    // 将commit和dispatch从this中解构出来
    const { commit, dispatch } = store
    this.commit = function(type, payload) {
      commit.call(store, type, payload)
    }
    this.dispatch = function(type, payload) {
      dispatch.call(store, type, payload)
    }
  }

  // 使用getter，返回state
  get state() {
    return this._vm._data.$$state
  }
  // 阻止用户直接修改state
  set state(val) {
    console.error('you can not change state by direct assignment "' + val + '"')
  }

  // 创建一个commit方法和dispatch方法
  commit(type, payload) {
    const entry = this._mutations[type]
    if (!entry) {
      console.error('unknown mutation type:' + type)
    }
    entry(this.state, payload)
  }
  dispatch(type, payload) {
    const entry = this._actions[type]
    if (!entry) {
      console.error('unknown action type:' + type)
    }
    entry(this.state, payload)
  }
}
```
