let Vue

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

export default { Store, install }
