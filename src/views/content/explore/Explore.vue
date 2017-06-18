<template>
  <div id="explore">
    <mu-drawer :open="open" width="30%" :docked="false" @close="toggleChannelList()">
      <mu-list>
        <mu-list-item v-for="channel in channelList" :title="channel.name" :key="channel.id" @click="jumpToChannelDetail(channel)">
        </mu-list-item>
      </mu-list>
    </mu-drawer>
    <mu-appbar title="发现" titleClass="center-block">
      <mu-flat-button @click="toggleChannelList()" label="频道" slot="left" icon="menu" primary/>
      <mu-flat-button slot="right" label="搜索" icon="search" to="/search" primary />      
    </mu-appbar>
    <vue-loading v-if="loading" type="bars" color="#009688" :size="{ width: '50px', height: '50px' }"></vue-loading>   
    <mu-content-block v-else>
      <swiper :options="swiperOption">
        <swiper-slide v-for="card in cardData" :key="card.id">
          <mu-paper class="card-paper" :zDepth="3" :rounded="true">
            <mu-content-block>
              <mu-grid-tile :titleBarClass="['title-bar']">
                <img class="display-img" :src="card.modifiedImg" alt="">
              </mu-grid-tile>
            </mu-content-block>
            <mu-content-block class="card-desc">
              <div class="card-desc-title">
                <div class="card-title">{{card.title}}</div>
                <mu-sub-header>{{card.short_title}}</mu-sub-header>
              </div>
              <div class="watch-btn-area">
                <mu-raised-button primary icon="visibility" label="查看详情" @click="jumpToVideoDetail(card)"/>
              </div>
            </mu-content-block>
          </mu-paper>
        </swiper-slide>
      </swiper>
    </mu-content-block>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import vueLoading from 'vue-loading-template'
import { getIqiyiResponse } from '@/api'
import * as types from '@/vuex/mutation-types'
import { saveChannelListToDB, getChannelListFromDB, getCardFromDB, saveCardToDB } from '@/database'

export default {
  name: 'explore',
  components: {
    swiper,
    swiperSlide,
    vueLoading
  },
  data () {
    return {
      open: false,
      loading: true,
      cardData: [],
      channelList: [],
      swiperOption: {
        loop: true,
        preloadImages: false,
        lazyLoading: true
      }
    }
  },
  methods: {
    toggleChannelList () {
      this.open = !this.open
    },
    jumpToChannelDetail (channel) {
      this.toggleChannelList()
      this.$store.commit(types.UPDATE_CHANNEL, {
        channelId: channel.id,
        channelName: channel.name
      })
      this.$router.push({
        name: 'channel-detail',
        params: {
          channelId: channel.id
        }
      })
    },
    jumpToVideoDetail (detail) {
      detail.modifiedImg = utils.handleImgUrl(detail.img, '480_270')
      if (detail.p_type === '1' || detail.p_type === '2') {
        detail.short_title = ''
      }
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
    getChannelList () {
      getChannelListFromDB().then(channelList => {
        this.channelList = channelList
        // update database every day
        if (channelList.length > 0 && Date.now() - channelList[0].datetime < 24 * 60 * 60 * 1000) {
          return Promise.resolve()
        } else {
          return Promise.reject()
        }
      }).catch(() => {
        return getIqiyiResponse('channel', {
          type: 'list'
        })
      }).then((response) => {
        if (response) {
          this.channelList = response.data
          saveChannelListToDB(response.data)
        }
      }).catch(error => {
        utils.showToast(error.toString())
      })
    },
    fetchCardData () {
      getCardFromDB().then(cardList => {
        // update database every hour
        if (cardList.length > 0 && Date.now() - cardList[0].datetime < 60 * 60 * 1000) {
          this.cardData = cardList
          this.loading = false
        } else {
          return getIqiyiResponse('recommend')
        }
      }).then(response => {
        if (response) {
          const originCardData = response.data.filter(item => {
            return item.title !== '轮播图' && item.title !== '资讯'
          }).reduce((pre, cur) => {
            return pre.concat(cur.video_list)
          }, []).map(item => {
            item.modifiedImg = utils.handleImgUrl(item.img)
            item.datetime = Date.now()
            if (item.p_type === '1') {
              item.short_title = utils.getRandomSlogan('film')
            } else if (item.p_type === '2') {
              item.short_title = utils.getRandomSlogan('teleplay')
            }
            return item
          })
          const tumbleCardData = utils.randomArray(originCardData)
          this.cardData = tumbleCardData
          this.loading = false
          saveCardToDB(tumbleCardData)
        }
      }).catch(error => {
        this.loading = false
        utils.showToast(error.toString())
      })
    }
  },
  created () {
    this.getChannelList()
    this.fetchCardData()
  }
}
</script>

<style lang="less">
#explore {
  position: relative;
  user-select: none;
  overflow: auto;
  .card-paper {
    width: 100%;
    height: 435px;
    .title-bar {
      display: none;
    }
    .display-img {
      width: 100%;
    }
    .card-desc {
      display: flex;
      flex-wrap: wrap;
      .card-desc-title {
        width: 100%;
        .card-title {
          font-size: 16px;
          padding-bottom: 5px;
          & + .mu-sub-header {
            padding-left: 0;
            line-height: 24px;
          }
        }
      }
      .watch-btn-area {
        width: 100%;
        text-align: center;
        margin-top: 10px;
      }
    }
  }
}
</style>

