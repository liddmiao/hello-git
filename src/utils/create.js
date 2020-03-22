import Vue from 'vue'
export function create1 (component, props) {
  // 通过vue构造函数动态生成组件，通过$mout()获取到真实的dom
  const vm = new Vue({
    render (h) {
      return h(component, { props })
    }
  }).$mount()
  // 将dom添加到body里面
  document.body.appendChild(vm.$el)
  // 销毁
  const comp = vm.$children[0]
  comp.remove = () => {
    document.body.removeChild(vm.$el)
    comp.$destroy
  }
  return comp
}
export function create (component, props) {
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