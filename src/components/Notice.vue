<template>
  <div class="box" v-show="isShow">
    <h2>{{title}}</h2>
    <p>{{message}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    show () {
      this.isShow = true
      setTimeout(this.hide, this.duration)
    },
    hide () {
      this.isShow = false
      this.remove()
    }
  }
}
</script>

<style>
.box {
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -100px;
  margin-left: -150px;
  width: 300px;
  height: 200px;
  text-align: center;
  border: 1px solid #000;
  background-color: #fff;
}
.box > p {
  width: 100%;
  padding: 10px;
}
</style>