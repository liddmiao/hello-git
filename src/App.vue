<template>
  <div id="app">
    <k-form :model="model" :rules="rules" ref="form">
      <k-form-item label="用户名" name="username">
        <k-input v-model="model.username" placeholder="请输入用户名"></k-input>
      </k-form-item>
      <k-form-item label="密码" name="password">
        <k-input v-model="model.password" placeholder="请输入密码" type="password"></k-input>
      </k-form-item>
      <button type="submit" @click="validateForm">校验</button>
    </k-form>
  </div>
</template>

<script>
import KInput from '@/components/KInput'
import KFormItem from '@/components/KFormItem.vue'
import KForm from '@/components/KForm.vue'
export default {
  name: 'App',
  data () {
    return {
      model: {
        username: '',
        password: ''
      },
      rules: {
        username: {
          required: true,
          message: '请输入用户名！'
        },
        password: {
          required: true,
          message: '请输入密码！'
        }
      }
    }
  },
  components: {
    KInput,
    KFormItem,
    KForm
  },
  methods: {
    validateForm () {
      this.$refs.form.validate(res => {
        if (res) {
          alert('success')
        } else {
          alert('failed')
        }
      })
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
