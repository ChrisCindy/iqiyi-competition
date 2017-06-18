import Vue from 'vue'
import Vuex from 'vuex'

import loading from './modules/loading'
import auth from './modules/auth'
import toast from './modules/toast'
import settings from './modules/settings'
import video from './modules/video'
import channel from './modules/channel'

Vue.use(Vuex)

const state = {}
const mutations = {}

const store = new Vuex.Store({
  state,
  mutations,
  modules: {
    loading,
    auth,
    toast,
    settings,
    video,
    channel
  }
})

export default store

