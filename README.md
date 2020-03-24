# helloworld

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

# 2020.03.20

## 解决$parent和$children 的耦合问题

阅读 element ui 的源码，element ui 使用混入，通过 componentName 动态地寻找父元素和子元素，实现了解耦

```JavaScript
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName
    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params))
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]))
    }
  })
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root
      var name = parent.$options.componentName

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.componentName
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    }
  }
}
```

call()、apply()、bind():都可以用来改变 this 的指向

call()和 apply()方法传参方式和不同，apply()的参数需要是一个数组

bind()参数和 call()一样，但是它返回一个函数

```JavaScript
var name = "json"
var age = 20
var obj = {
    name: "java",
    ages: this.age,
    fn: function(s){
        if (!s) {
           console.log(this.ages)
        } else {
            console.log(this.ages + '' + s.name)
        }
    }
}
var obj1 = {
    name: "PHP",
    ages: 10
}


obj.fn() //20 this永远指向最后调用它的那个对象
obj.fn(obj1) //20PHP
obj.fn.call(obj1,obj1) //10PHP call改变了指向，this指向obj1
obj.fn.apply(obj1,[obj1]) //10PHP apply也将this指向改变为obj1，但是参数是个数组
obj.fn.bind(obj1,obj1)() //10PHP bind成功改变了指向，但是返回的是个函数，需要主动调用一次
```

## Vue.extend()实现 create 方法

Vue.extend()是 vue 的一个全局 api，参数是一个包含组件选项的对象，返回一个构造方法，这个构造方法可以通过 propsData 属性传参

create.js

```javascript
import Vue from 'vue'
export function create(component, props) {
  // 通过Vue.extend得到一个构造函数
  const Ctor = Vue.extend(component)
  // 利用构造函数得到组件实例，并挂载
  const comp = new Ctor({ propsData: props })
  comp.$mount()
  document.body.appendChild(comp.$el)
  comp.remove = () => {
    document.body.removeChild(comp.$el)
    comp.$destroy()
  }
  return comp
}
```

将 create 方法添加到 vue 原型链上，便可以随时调用了

```javascript
import { create } from '@/utils/create.js'

Vue.prototype.$create = create
```

Vue.component()可以使用 Vue.extend()返回的构造函数来注册一个组件，并给这个组件命名

# 2020.03.20

## 手写一个简单的 vue-router
