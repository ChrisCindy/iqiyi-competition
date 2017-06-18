// import Vue from 'vue'
import router from '@/router'
import store from '@/vuex'
import * as types from '@/vuex/mutation-types'

import { saveUser, validateUser } from '@/database'

/**
* Auth Plugin
*
*
* Handles login.
*/
export default {

  /**
   * Install the Auth class.
   *
   * @param {Object} Vue The global Vue.
   * @param {Object} options Any options we want to have in our plugin.
   * @return {void}
   */
  install (Vue, options) {
    Vue.prototype.$auth = Vue.auth = this
  },

  /**
   * Login
   *
   * @param {Object.<string>} creds The username and password for logging in.
   * @param {string|null} redirect The name of the Route to redirect to.
   * @return {void}
   */
  login (creds) {
    return validateUser(creds.nickname, creds.password).then(result => {
      if (result) {
        this._storeUserInfo(creds)
        store.commit(types.UPDATE_AUTH_STATUS, {
          isLoggedIn: true
        })
        return Promise.resolve(result)
      } else {
        return Promise.reject(result)
      }
    })
  },

  /**
   * Logout
   *
   * update auth status and redirect back
   * to login form.
   *
   * @return {void}
   */
  logout () {
    store.commit(types.UPDATE_AUTH_STATUS, {
      isLoggedIn: false
    })
    router.push({ name: 'login' })
  },

  /**
   * signup
   *
   * @param {Object.<string>} creds The username and password for logging in.
   * @return {void}
   */

  signup (creds) {
    return saveUser(creds.nickname, creds.password).then(result => {
      return Promise.resolve(result)
    }).catch(error => {
      return Promise.reject(error)
    })
  },

  /**
   *
   * @private
   * @param {Object} userInfo
   * @return {void}
   */
  _storeUserInfo (userInfo) {
    store.commit(types.UPDATE_AUTH_STATUS, {
      isLoggedIn: true
    })
    store.commit(types.UPDATE_USER, {
      user: {
        nickname: userInfo.nickname
      }
    })
  }
}
