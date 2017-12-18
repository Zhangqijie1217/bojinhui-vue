// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import store from './vuex'
import VueLazyload from 'vue-lazyload'
import { ToastPlugin } from 'vux'
import 'assets/css/base.less'
import 'assets/js/fit.js'
import 'assets/css/customer-vux-style.less'

Vue.use(ToastPlugin)
Vue.use(VueLazyload, {
  preLoad: 1,
  error: 'src/assets/img/loading.svg',
  loading: 'src/assets/img/loading.svg',
  attempt: 1
})

FastClick.attach(document.body)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app-box',
  store,
  router,
  render: h => h(App)
})

// router.beforeEach((to, from, next) => {
//   console.log(to)
//   console.log(from)
//   next()
// })
