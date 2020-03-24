// 通过响应式数据获取路由的变化，取到当前路由对应的component，使用render函数
export default {
  render(h) {
    let component
    const route = this.$router.routeMap[this.$router.current]
    if (route) {
      component = route
    }
    return h(component)
  }
}
