<template>
  <div id="channel-detail" ref="wrapper">
    <mu-appbar class="is-fixed-top">
      <mu-flat-button slot="left" @click="goBack" :label="channelName" icon="navigate_before" labelClass="channel-title"/>
      <mu-dropDown-menu style="height: 56px;color: #FFF" slot="right" :value="channelId" :autoWidth="true" labelClass="appbar-text-color" iconClass="appbar-text-color" :maxHeight="300">
        <mu-menu-item value="0" title="频道"></mu-menu-item>
        <mu-menu-item v-for="channel in channelList" :value="channel.id" :title="channel.name" :key="channel.id" @click="switchChannel(channel)"/>
      </mu-dropDown-menu> 
      <mu-dropDown-menu style="height: 56px;color: #FFF" slot="right" :value="sortMode" @change="switchSortMode" :autoWidth="true" labelClass="appbar-text-color" iconClass="appbar-text-color">
        <mu-menu-item v-for="mode in sortModeList" :value="mode.value" :title="mode.title" :key="mode.value"/>
      </mu-dropDown-menu>
      <mu-icon-button slot="right" icon="search" to="/search" />
    </mu-appbar>
    <vue-loading style="padding-top: 56px;" v-if="loadingBar" type="bars" color="#009688" :size="{ width: '50px', height: '50px' }"></vue-loading>
    <div v-else class="detail-data-list">
      <mu-grid-tile v-for="detail in detailDataList" :key="detail.id">
        <div style="height: 200px;" @click="jumpToVideoDetail(detail)">
          <img class="display-img" :src="detail.modifiedImg"/>
        </div>
        <span slot="title" class="assist-detail-data" @click="jumpToVideoDetail(detail)">{{detail.title}}</span>
        <span slot="subTitle" class="assist-detail-data" @click="jumpToVideoDetail(detail)">
          <mu-icon-button icon="visibility"/>
          <span>{{detail.play_count_text}}</span>
          <mu-icon-button icon="equalizer" v-if="!!detail.sns_score"/>
          <span v-if="!!detail.sns_score">{{detail.sns_score}}</span>
        </span>
      </mu-grid-tile>
      <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMoreDetailData"/>
    </div>
  </div>
</template>

<script>
import vueLoading from 'vue-loading-template'
import { getIqiyiResponse } from '@/api'
import { mapState } from 'vuex'
import * as types from '@/vuex/mutation-types'
import { getChannelListFromDB, saveChannelListToDB } from '@/database'

export default {
  name: 'channel-detail',
  components: {
    vueLoading
  },
  data () {
    return {
      open: false,
      loadingBar: true,
      channelList: [{
        id: '1',
        name: '电影'
      }],
      detailDataList: [],
      pageNum: 1,
      loading: false,
      scroller: null,
      channelId: '0',
      sortMode: '11',
      sortModeList: [{
        value: '11',
        title: '热播榜'
      }, {
        value: '1',
        title: '相关性'
      }, {
        value: '2',
        title: '创建时间'
      }, {
        value: '4',
        title: '新上线'
      }, {
        value: '5',
        title: 'vv'
      }, {
        value: '8',
        title: '好评榜'
      }, {
        value: '9',
        title: '历史点击量'
      }, {
        value: '10',
        title: '周点击量'
      }]
    }
  },
  computed: {
    ...mapState({
      channelName: state => state.channel.channelName
    })
  },
  methods: {
    goBack () {
      window.history.go(-1)
    },
    fetchDetailData (pageNum, mode = '11') {
      return getIqiyiResponse('channel', {
        type: 'detail',
        mode: mode,
        channel_name: this.channelName,
        page_num: pageNum,
        page_size: 15
      }).then(response => {
        this.loadingBar = false
        if (response.code === 100002) {
          return Promise.reject(response.errorReason)
        } else {
          const detailDataList = response.data.video_list.map(item => {
            item.modifiedImg = utils.handleImgUrl(item.img, '480_360')
            return item
          })
          return Promise.resolve(detailDataList)
        }
      }).catch(error => {
        this.loadingBar = false
        return Promise.reject(error)
      })
    },
    fetchMoreDetailData () {
      this.fetchDetailData(++this.pageNum).then(response => {
        this.detailDataList = this.detailDataList.concat(response)
      }).catch(error => {
        utils.showToast(error.toString())
      })
    },
    loadMoreDetailData () {
      this.loading = true
      this.fetchMoreDetailData()
    },
    jumpToVideoDetail (detail) {
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
    jumpToChannelDetail (channelName) {
      this.toggleChannelList()
      this.$router.push({
        name: 'channel-detail',
        params: {
          channelName: channelName
        }
      })
    },
    switchChannel (channel) {
      this.$store.commit(types.UPDATE_CHANNEL, {
        channelId: channel.id,
        channelName: channel.name
      })
      this.$router.replace({
        name: 'channel-detail',
        params: {
          channelId: channel.id
        }
      })
    },
    getChannelList () {
      getChannelListFromDB().then(channelList => {
        if (channelList.length > 0) {
          this.channelList = channelList
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
    switchSortMode (mode) {
      this.sortMode = mode
      this.loadingBar = true
      this.pageNum = 1
      this.fetchDetailData(this.pageNum, this.sortMode).then(response => {
        this.detailDataList = response
      }).catch(error => {
        utils.showToast(error.toString())
      })
    }
  },
  created () {
    this.getChannelList()
    this.fetchDetailData(this.pageNum).then(response => {
      this.detailDataList = response
    }).catch(error => {
      utils.showToast(error.toString())
    })
  },
  mounted () {
    this.scroller = this.$el
  },
  watch: {
    $route (to, from) {
      // TODO
      // add loading bar
      this.pageNum = 1
      this.loadingBar = true
      this.fetchDetailData(this.pageNum).then(response => {
        this.detailDataList = response
      }).catch(error => {
        this.detailDataList = []
        utils.showToast(error.toString())
      })
    }
  }
}
</script>

<style lang="less">
#channel-detail {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  .mu-appbar {
    padding: 0;
    .left {
      flex-shrink: 1;
    }
    .right {
      flex-shrink: 1;
    }
  }
  .channel-title{
    font-size: 15px;
  }
  .detail-data-list {
    padding-top: 56px;
    .display-img {
      width: 100%;
    }
    .assist-detail-data {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

</style>
