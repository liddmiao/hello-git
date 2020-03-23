<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'KForm',
  componentName: 'KForm',
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: Object
  },
  data () {
    return {
      childNodes: []
    }
  },
  provide () {
    return {
      form: this
    }
  },
  mounted () {
    this.$on('kfrom.addChildNodes', (node) => {
      this.childNodes.push(node)
    })
  },
  methods: {
    validate (callback) {
      // validate方法返回一个promise，成功是resolve，失败是reject
      let result = this.childNodes.map(item => item.validate())
      Promise.all(result).then(() => {
        callback(true)
      }).catch(() => {
        callback(false)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
</style>