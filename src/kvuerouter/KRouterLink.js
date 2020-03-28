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