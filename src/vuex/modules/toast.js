import * as types from '../mutation-types'

const toast = {
  state: {
    showToast: false,
    toastMessage: ''
  },
  mutations: {
    [types.UPDATE_TOAST] (state, payload) {
      state.showToast = payload.showToast
      state.toastMessage = payload.toastMessage
    }
  },
  actions: {
    [types.UPDATE_TOAST] ({commit}, payload) {
      setTimeout(() => {
        commit(types.UPDATE_TOAST, {
          showToast: false,
          toastMessage: ''
        })
      }, payload.time)
    }
  }
}

export default toast
