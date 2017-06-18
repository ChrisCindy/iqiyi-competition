import * as types from '../mutation-types'

const settings = {
  state: {
    nightMode: false
  },
  mutations: {
    [types.UPDATE_SETTINGS_STATUS] (state, payload) {
      state.nightMode = payload.nightMode
    }
  }
}

export default settings
