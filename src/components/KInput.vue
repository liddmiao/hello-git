<template>
  <input :value="value" @input="input" v-bind="$attrs" />
</template>

<script>
export default {
  props: {
    value: String
  },
  methods: {
    input (e) {
      this.$emit('input', e.target.value)
      this.$parent.$emit('validate')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>