import * as types from '../mutation-types'

const video = {
  state: {
    detail: {}
  },
  getters: {
    presentYear: state => {
      const detail = state.detail
      if (detail.date_format) {
        return state.detail.date_format.split('-')[0]
      } else {
        return ''
      }
    },
    videoTypeText: state => {
      switch (state.detail.p_type) {
        case '1': return '类别：单视频'
        case '2': return '类别：剧集'
        case '3': return '类别：综艺'
      }
    },
    videoScoreText: state => {
      const detail = state.detail
      if (detail.sns_score) {
        return `评分：${detail.sns_score}`
      } else {
        return null
      }
    },
    videoPlayCountText: state => {
      return `播放量：${state.detail.play_count_text}`
    },
    videoUpdateText: state => {
      const detail = state.detail
      if (detail.p_type === '1') {
        if (detail.type === 'normal') {
          return '正片'
        } else {
          return '预告'
        }
      } else if (detail.p_type === '2') {
        if (detail.update_num === detail.total_num) {
          return `${detail.total_num}集全`
        } else {
          return `更新到${detail.update_num}集`
        }
      } else {
        return `更新到${detail.date_format}期`
      }
    }
  },
  mutations: {
    [types.UPDATE_VIDEO_DETAIL] (state, payload) {
      state.detail = payload.detail
    }
  }
}

export default video
