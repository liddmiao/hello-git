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

## 解决$parent和$children的耦合问题



## Vue.extend()实现create方法

Vue.extend()是vue的一个全局api，参数是一个包含组件选项的对象，返回一个构造方法，这个构造方法可以通过propsData属性传参

create.js

```javascript
import Vue from 'vue'
export function create (component, props) {
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

将create方法添加到vue原型链上，便可以随时调用了

```javascript
import { create } from '@/utils/create.js';

Vue.prototype.$create = create
```

Vue.component()可以使用Vue.extend()返回的构造函数来注册一个组件，并给这个组件命名