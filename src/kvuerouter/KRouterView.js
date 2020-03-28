// 这个组件就是获取当前路由对应的组件，拿到这个组件对象，并渲染到页面中
export default {
  // 只有一层路由的情况
  // render (h) {
  //   let component = null
  //   // 通过this.$router.routerMap获取创建的路由map，通过this.$router.current获取当前链接
  //   let route = this.$router.routerMap[this.$router.current]
  //   if (route) {
  //     component = route
  //   }
  //   return h(component)
  // }

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