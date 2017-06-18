import * as types from '../mutation-types'

const loading = {
  state: {
    isLoading: false
  },
  mutations: {
    [types.UPDATE_LOADING_STATUS] (state, payload) {
      state.isLoading = payload.isLoading
    }
  }
}

export default loading
