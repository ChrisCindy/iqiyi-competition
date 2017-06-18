import * as types from '../mutation-types'

const channel = {
  state: {
    channelId: '',
    channelName: ''
  },

  mutations: {
    [types.UPDATE_CHANNEL] (state, payload) {
      state.channelId = payload.channelId
      state.channelName = payload.channelName
    }
  }
}

export default channel
