export default {
  props: {
    to: String,
    required: true
  },
  render(h) {
    //需要一个<a href="/aa">aa</a>
    // 使用h函数
    return h('a', { attrs: { href: '#' + this.to } }, [this.$slots.default])
    // 可以使用jsx语法，但是仅限于vuecli创建的项目
    // return <a href={'#' + this.to}>{this.$slots.default}</a>
  }
}
