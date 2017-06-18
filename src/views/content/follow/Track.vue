<template>
  <div id="track">
    <div class="no-track-tip" v-if="trackVideo.length === 0">
      您没有在追的剧，赶快去关注吧~
    </div>
    <mu-list v-else>
      <mu-list-item @click="jumpToVideoDetail(video)" v-for="video in trackVideo" :title="video.title" :key="video.id">
        <img class="left-cover"
        :src="video.img" alt="" slot="left">
        <span slot="describe">
          <span>{{video.date_format}}</span>
          <br/>
          {{video.videoUpdateText}}
        </span>
        <mu-divider />
      </mu-list-item>

    </mu-list>
  </div>
</template>

<script>
import { getFollowVideo, saveFollowVideo } from '@/database'
import { mapState } from 'vuex'
import * as types from '@/vuex/mutation-types'
import { getIqiyiResponse } from '@/api'

export default {
  name: 'track',
  data () {
    return {
      trackVideo: []
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.auth.user.nickname
    })
  },
  methods: {
    jumpToVideoDetail (detail) {
      detail.modifiedImg = utils.handleImgUrl(detail.img, '480_270')
      this.$store.commit(types.UPDATE_VIDEO_DETAIL, {
        detail
      })
      this.$router.push({
        name: 'video-detail',
        params: {
          videoId: detail.id
        }
      })
    },
    checkUpdate (video) {
      if (Date.now() - parseInt(video.date_timestamp) < 24 * 60 * 60 * 1000 || video.update_num === video.total_num) {
        return
      }
      getIqiyiResponse('search', {
        key: video.title,
        from: 'mobile_list',
        page_num: 1,
        page_size: 50
      }).then(response => {
        for (let item of response.data) {
          if (item.id === video.id) {
            if (item.p_type === '2') {
              if (item.update_num !== video.update_num) {
                video.update_num = item.update_num
                saveFollowVideo('track', item)
              }
            } else {
              if (item.date_timestamp !== video.date_timestamp) {
                video.date_timestamp = item.date_timestamp
                video.date_format = item.date_format
                saveFollowVideo('track', item)
              }
            }
            break
          }
        }
      }).catch(() => {
      })
    }
  },
  created () {
    getFollowVideo('track', this.nickname).then(videos => {
      this.trackVideo = videos.map(video => {
        video.modifiedImg = utils.handleImgUrl(video.img, '180_236')
        return video
      })
      this.trackVideo.map(this.checkUpdate)
    })
  }
}
</script>

<style lang="less">
  #track {
    .no-track-tip {
      margin-top: 60px;
      text-align: center;
    }
    .left-cover {
      width: 125%;
    }
  }
</style>
