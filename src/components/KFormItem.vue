<template>
  <div>
    <label v-if="label">{{label}}</label>
    <slot></slot>
    <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
import Schema from 'async-validator'
import emitter from '@/mixins/emitter.js'
export default {
  name: 'KFormItem',
  componentName: 'KFormItem',
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
  mixins: [emitter],
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
    this.dispatch('KForm', 'kfrom.addChildNodes', [this])
  }
}
</script>

<style lang="scss" scoped>
</style>