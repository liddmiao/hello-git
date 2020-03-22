<template>
  <div>
    <label v-if="label">{{label}}</label>
    <slot></slot>
    <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
import Schema from 'async-validator'
export default {
  data () {
    return {
      error: ''
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    name: String
  },
  inject: ['form'],
  methods: {
    validate () {
      const rule = this.form.rules[this.name]
      const value = this.form.model[this.name]
      // 创建校验器
      const validator = new Schema({ [this.name]: rule })
      return new Promise((resolve, reject) => {
        validator.validate({ [this.name]: value }, errorMsg => {
          if (errorMsg) {
            this.error = errorMsg[0].message
            reject()
          } else {
            this.error = ''
            resolve()
          }
        })
      })
    }
  },
  mounted () {
    this.$on('validate', () => {
      const pro = this.validate()
      pro.then(() => {
        console.log('resolve')
      }, () => {
        console.log('reject')
      })
    })
  }
}
</script>

<style lang="scss" scoped>
</style>