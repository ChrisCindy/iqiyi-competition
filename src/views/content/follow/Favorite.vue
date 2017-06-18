<template>
  <div id="favorite">
    <div class="no-favorite-tip" v-if="favoriteVideo.length === 0">
      您没有收藏的视频，赶快去关注吧~
    </div>
    <mu-list>
      <mu-list-item @click="jumpToVideoDetail(video)" v-for="video in favoriteVideo" :title="video.title" :key="video.id">
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
import { getFollowVideo } from '@/database'
import { mapState } from 'vuex'
import * as types from '@/vuex/mutation-types'

export default {
  name: 'favorite',
  data () {
    return {
      favoriteVideo: []
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
    }
  },
  created () {
    getFollowVideo('favorite', this.nickname).then(videos => {
      this.favoriteVideo = videos.map(video => {
        video.modifiedImg = utils.handleImgUrl(video.img, '180_236')
        return video
      })
    })
  }
}
</script>

<style lang="less">
  #favorite {
    .no-favorite-tip {
      margin-top: 60px;
      text-align: center;
    }
    .left-cover {
      width: 125%;
    }
  }
</style>
