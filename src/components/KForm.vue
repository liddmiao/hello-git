<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: Object
  },
  provide () {
    return {
      form: this
    }
  },
  methods: {
    validate (callback) {
      let result = this.$children.filter(item => item.name).map(item => {
        // validate方法返回一个promise，成功是resolve，失败是reject
        return item.validate()
      })
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