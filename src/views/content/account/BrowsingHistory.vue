<template>
  <div id="browsing-history">
    <mu-appbar title="浏览记录" titleClass="center-block">
      <mu-flat-button slot="left" @click="goBack" label="返回" icon="navigate_before" primary/>
      <mu-flat-button slot="right"  labelPosition="before" @click="goBackHome" label="主页" icon="home" primary />
    </mu-appbar>
    <div class="no-history-tip" v-if="historyVideo.length === 0">
      暂无浏览记录
    </div>
    <mu-list v-else>
      <template v-for="video in historyVideo">
        <mu-list-item @click="jumpToVideoDetail($event, video)"  :title="video.title" :describeLine="1" :key="video.id">
          <img class="left-cover"
          :src="video.img" alt="" slot="left">
          <span slot="describe">
            <span>{{video.presentYear}} - </span>
            {{video.videoUpdateText}}
          </span>
          <mu-icon-menu slot="right" icon="more_vert" tooltip="操作">
            <mu-menu-item@click="deleteHistory(video)" title="删除" />
          </mu-icon-menu>
        </mu-list-item>
        <mu-divider />
      </template>
    </mu-list>
  </div>
</template>

<script>
import { getHistoryVideo, deleteHistoryVideo } from '@/database'
import { mapState } from 'vuex'
import * as types from '@/vuex/mutation-types'

export default {
  name: 'browsing-history',
  data () {
    return {
      historyVideo: []
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.auth.user.nickname
    })
  },
  methods: {
    goBack () {
      window.history.go(-1)
    },
    goBackHome () {
      this.$router.push({
        name: 'track'
      })
    },
    jumpToVideoDetail (event, detail) {
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
    deleteHistory (detail) {
      deleteHistoryVideo(detail.id, this.nickname).then(deletedCount => {
        const index = this.historyVideo.findIndex((element) => {
          return element.id === detail.id
        })
        this.historyVideo.splice(index, 1)
      }).catch(error => {
        utils.showToast(error.toString())
      })
    }
  },
  created () {
    getHistoryVideo(this.nickname).then(videos => {
      this.historyVideo = videos.map(video => {
        video.modifiedImg = utils.handleImgUrl(video.img, '180_236')
        return video
      })
    })
  }
}
</script>

<style lang="less">
  #browsing-history {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 56px;
    .no-history-tip {
      margin-top: 60px;
      text-align: center;
    }
    .left-cover {
      width: 125%;
    }
  }
</style>
