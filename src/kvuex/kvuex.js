let Vue

class Store {
  constructor(options) {
    // 创建响应式数据
    // this.vm = new Vue({ 通过这种方式创建的响应式数据，需要从this.vm._data.$$store,加两个$是为了不让state被vue默认代理，导致使用this.vm.state能访问到值
    //   data() {
    //     return {
    //       $$state: options.state
    //     }
    //   }
    // })
    Vue.util.defineReactive(this, '$state', options.state)
    // 存储mutations和actions
    this._mutations = options.mutations
    this._actions = options.actions

    const store = this
    const { commit, dispatch } = store
    this.commit = function(type, payload) {
      commit.call(store, type, payload)
    }
    this.dispatch = function(type, payload) {
      dispatch.call(store, type, payload)
    }
  }
  get state() {
    // return this.vm._data.$$state
    return this.$state
  }
  // 阻止用户直接改变state的值
  set state(val) {
    console.error('you can not change state by direct assignment "' + val + '"')
  }
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
      console.error('unknown action type' + type)
    }
    entry(this.state, payload)
  }
}
function install(_vue) {
  Vue = _vue
  Vue.mixin({
    // 和router一样，需要挂载到vue原型链上去
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default { Store, install }
