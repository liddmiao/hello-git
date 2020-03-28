let Vue

class Store {
  constructor(options) {
    // 创建响应式数据
    // Vue.util.defineReactive(this, '$state', options.state)
    this._vm = new Vue({
      data: {
        $$state: options.state
      }
    })
    this._mutations = options.mutations
    this._actions = options.actions

    const store = this
    const { commit, dispatch } = store
    this.commit = function (type, payload) {
      commit.call(store, type, payload)
    }
    this.dispatch = function (type, payload) {
      dispatch.call(store, type, payload)
    }
  }
  get state () {
    return this._vm._data.$$state
    // return this.$state
  }
  // 阻止用户直接改变state的值
  set state (val) {
    console.error('you can not change state by direct assignment "' + val + '"')
  }
  commit (type, payload) {
    const entry = this._mutations[type]
    if (!entry) {
      console.error('unknown mutation type:' + type)
    }
    entry(this.state, payload)
  }
  dispatch (type, payload) {
    const entry = this._actions[type]
    if (!entry) {
      console.error('unknown action type' + type)
    }
    entry(this.state, payload)
  }
}
function install (_vue) {
  Vue = _vue
  Vue.mixin({
    // 和router一样，需要挂载到vue原型链上去
    beforeCreate () {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default { Store, install }
