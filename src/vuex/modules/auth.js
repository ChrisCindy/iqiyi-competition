import * as types from '../mutation-types'

const auth = {
  state: {
    isLoggedIn: false,
    user: {
      nickname: null
    },
    changePwdNickname: null
  },
  mutations: {
    [types.UPDATE_AUTH_STATUS] (state, payload) {
      state.isLoggedIn = payload.isLoggedIn
    },
    [types.UPDATE_USER] (state, payload) {
      state.user = payload.user
    },
    [types.UPDATE_CHANGE_PWD_NICKNAME] (state, payload) {
      state.changePwdNickname = payload.changePwdNickname
    }
  }
}

export default auth
