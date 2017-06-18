<template>
  <div id="video-detail">
    <mu-appbar title="视频详情" titleClass="center-block">   
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
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { isInCollection, saveFollowVideo, deleteFollowVideo } from '@/database'

export default {
  name: 'video-detail',
  data () {
    return {
      isCollected: false
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
      'videoUpdateText'
    ])
  },
  methods: {
    playVideo () {
      let iqiyiScheme = `iqiyi://mobile/player?aid=${this.detail.a_id}&tvid=${this.detail.tv_id}&ftype=27&to=3&url=${location.href}`
      location.href = iqiyiScheme
    },
    collect (video) {
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
    }
  },
  created () {
    if (this.detail.p_type === '1') {
      isInCollection('favorite', this.detail.id, this.nickname).then(result => {
        this.isCollected = result
      })
    } else {
      isInCollection('track', this.detail.id, this.nickname).then(result => {
        this.isCollected = result
      })
    }
  }
}
</script>
