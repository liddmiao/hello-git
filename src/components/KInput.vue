<template>
  <input :value="value"
         @input="input"
         v-bind="$attrs" />
</template>

<script>
import emitter from '@/mixins/emitter.js'
export default {
  props: {
    value: String
  },
  mixins: [emitter],
  methods: {
    input (e) {
      this.$emit('input', e.target.value)
      // this.$parent.$emit('validate')
      this.dispatch('KFormItem', 'validate')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>