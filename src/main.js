// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import MuseUI from 'muse-ui'

import App from './App'

import router from './router'
import store from './vuex'
import Auth from './auth'

import {sync} from 'vuex-router-sync'

// css related
import 'normalize.css'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-teal.css'
import 'animate.css'
import '@/assets/less/main.less'

const FastClick = require('fastclick')
FastClick.attach(document.body)

sync(store, router)

Vue.use(MuseUI)
Vue.use(Vuex)

/* Auth plugin */
Vue.use(Auth)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
