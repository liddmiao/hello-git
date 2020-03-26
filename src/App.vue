<template>
  <div id="app">
    <router-link to="/">home |</router-link>
    <router-link to="/about">about</router-link>
    <router-view></router-view>
    <k-form :model="model"
            :rules="rules"
            ref="form">
      <k-form-item label="用户名"
                   name="username">
        <k-input v-model="model.username"
                 placeholder="请输入用户名"></k-input>
      </k-form-item>
      <k-form-item label="密码"
                   name="password">
        <k-input v-model="model.password"
                 placeholder="请输入密码"
                 type="password"></k-input>
      </k-form-item>
      <button type="submit"
              @click="validateForm">校验</button>
    </k-form>
    <div @click="$store.commit('SET_COUNT',2)">{{$store.state.count}}</div>
    <div @click="$store.dispatch('ASYNC_COUNT',10)">async: {{$store.state.count}}</div>
    <div @click="$store.state = 'dididid'">直接改变state</div>
  </div>
</template>

<script>
import KInput from '@/components/KInput'
import KFormItem from '@/components/KFormItem.vue'
import KForm from '@/components/KForm.vue'
import Notice from '@/components/Notice.vue'
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
          this.$create(Notice, {
            title: '校验失败',
            message: '请检查必填项！',
            duration: 3000
          }).show()
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
