<template>
  <div id="favorite">
    <div class="no-favorite-tip" v-if="favoriteVideo.length === 0">
      您没有收藏的视频，赶快去关注吧~
    </div>
    <mu-list v-else>
      <template v-for="video in favoriteVideo">
        <mu-list-item @click="jumpToVideoDetail($event,video)" :title="video.title" 
        :describeLine="1" :key="video.id">
        <img class="left-cover"
        :src="video.img" alt="" slot="left">
          <span slot="describe">
            <span>{{video.presentYear}} - </span>
            {{video.videoUpdateText}}
          </span>
          <mu-icon-menu slot="right" icon="more_vert" tooltip="操作">
            <mu-menu-item title="取消关注" @click="cancelCollect(video)" />
          </mu-icon-menu>
        </mu-list-item>
        <mu-divider />
      </template>
    </mu-list>
  </div> 
</template>

<script>
import { getFollowVideo, deleteFollowVideo } from '@/database'
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
    jumpToVideoDetail (evenvt, detail) {
      if (event.target.classList[0] === 'mu-ripple-wrapper') {
        return
      }
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
    cancelCollect (detail) {
      deleteFollowVideo('favorite', detail.id, this.nickname).then(deletedCount => {
        const index = this.favoriteVideo.findIndex((element) => {
          return element.id === detail.id
        })
        this.favoriteVideo.splice(index, 1)
      }).catch(error => {
        utils.showToast(error.toString())
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
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 56px;
    .no-favorite-tip {
      margin-top: 60px;
      text-align: center;
    }
    .left-cover {
      width: 125%;
    }
  }
</style>
