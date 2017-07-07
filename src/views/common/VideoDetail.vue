<template>
  <div id="video-detail">
    <mu-appbar title="视频详情" titleClass="center-block">
      <mu-flat-button slot="left" @click="goBack" label="返回" icon="navigate_before" primary/>
      <mu-flat-button slot="right"  labelPosition="before" label="分享" icon="share" primary @click="shareToFriends" :data-clipboard-text="shareUrl" id="share-btn"/>   
    </mu-appbar>
    <mu-card>
      <mu-card-header :title="videoTypeText" :subTitle="detail.date_format">
      </mu-card-header>
      <mu-card-media :title="detail.title" :subTitle="(detail.short_title === detail.title || detail.short_title === '')? videoScoreText : detail.short_title">
        <img :src="detail.modifiedImg" />
      </mu-card-media>
      <mu-card-title :title="videoUpdateText" :subTitle="videoPlayCountText"/>
      <mu-card-actions>
        <mu-flat-button icon="play_circle_outline" label="点击播放" @click="playVideo"/>
        <mu-flat-button v-if="!isCollected" icon="favorite_border" label="关注" @click="collect(detail)"/>
        <mu-flat-button v-else icon="favorite" label="取消关注" @click="cancelCollect(detail.id)"/>
      </mu-card-actions>
    </mu-card>
    <mu-dialog :open="shareDialog" title="生成分享网址">
        拷贝以下链接发送给好友吧：
        <br/>
        {{shareUrl}}
      <mu-flat-button label="确定" slot="actions" primary @click="closeShareDialog"/>
    </mu-dialog>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import { mapState, mapGetters } from 'vuex'
import { isInCollection, saveFollowVideo, deleteFollowVideo, saveHistoryVideo } from '@/database'

export default {
  name: 'video-detail',
  data () {
    return {
      isCollected: false,
      shareDialog: false
    }
  },
  computed: {
    ...mapState({
      detail: state => state.video.detail,
      nickname: state => state.auth.user.nickname
    }),
    ...mapGetters([
      'videoTypeText',
      'videoScoreText',
      'videoPlayCountText',
      'videoUpdateText',
      'presentYear'
    ]),
    iqiyiScheme () {
      let scheme = `iqiyi://mobile/player?aid=${this.detail.a_id}&tvid=${this.detail.tv_id}&ftype=27&to=3&url=${location.href}`
      return scheme
    },
    shareUrl () {
      let url = `http://chriscindytop/share/?a_id=${this.detail.a_id}&tv_id=${this.detail.tv_id}`
      return url
    }
  },
  methods: {
    goBack () {
      window.history.go(-1)
    },
    playVideo () {
      location.href = this.iqiyiScheme
    },
    collect (video) {
      video.presentYear = this.presentYear
      video.nickname = this.nickname
      video.videoUpdateText = this.videoUpdateText
      if (this.detail.p_type === '1') {
        saveFollowVideo('favorite', video).then(id => {
          this.isCollected = true
        }).catch(error => {
          utils.showToast(error.toString())
        })
      } else {
        saveFollowVideo('track', video).then(id => {
          this.isCollected = true
        }).catch(error => {
          utils.showToast(error.toString())
        })
      }
    },
    cancelCollect (videoId) {
      if (this.detail.p_type === '1') {
        deleteFollowVideo('favorite', videoId, this.nickname).then(deletedCount => {
          this.isCollected = false
        }).catch(error => {
          utils.showToast(error.toString())
        })
      } else {
        deleteFollowVideo('track', videoId, this.nickname).then(deletedCount => {
          this.isCollected = false
        }).catch(error => {
          utils.showToast(error.toString())
        })
      }
    },
    closeShareDialog () {
      this.shareDialog = false
    },
    shareToFriends () {
      if (!Clipboard.isSupported()) {
        this.shareDialog = true
      } else {
        let clipboard = new Clipboard('#share-btn')
        clipboard.on('success', e => {
          utils.showToast('网址已复制到剪贴板，快去粘贴发送给好友吧！', 2000)
        })
        clipboard.on('error', e => {
          this.shareDialog = true
        })
      }
    }
  },
  created () {
    let video = Object.assign({}, this.detail, {
      presentYear: this.presentYear,
      nickname: this.nickname,
      videoUpdateText: this.videoUpdateText,
      time: new Date()
    })
    saveHistoryVideo(video)
    if (this.detail.p_type === '1') {
      isInCollection('favorite', this.detail.id, this.nickname).then(result => {
        this.isCollected = result
      })
    } else {
      isInCollection('track', this.detail.id, this.nickname).then(result => {
        this.isCollected = result
      })
    }
    /* eslint-disable no-new */
    // let clipboard = new Clipboard('#share-btn')
  },
  destroyed () {
    // clipboard.destroy()
  }
}
</script>

<style lang="less">
#video-detail {
}
.mu-dialog {
  width: 80%;
  .mu-dialog-body {
    font-size: 14px;
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>
