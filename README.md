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
