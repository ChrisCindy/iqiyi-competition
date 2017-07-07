<template>
  <div id="search">
    <mu-appbar>
      <mu-flat-button @click="goBack()" slot="left" label="返回" icon="navigate_before" primary/>
      <mu-text-field class="appbar-search-field" icon="search" slot="right" hintText="输入搜索内容" v-model="searchQuery" @focus="showRecordAction" @blur="hideRecordAction"/>
    </mu-appbar>
    <div v-if="showRecord">
      <mu-sub-header>
        最近搜索记录
      </mu-sub-header>
      <mu-content-block>
        <mu-chip class="record-chip" v-for="(record, index) in searchRecordList" :key="index" showDelete @delete="deleteRecord(record)">{{record.keyword}}</mu-chip>
      </mu-content-block>
    </div>
    <div v-else>
      <vue-loading v-if="loadingBar" type="bars" color="#009688" :size="{ width: '50px', height: '50px' }"></vue-loading>
      <div v-else class="search-frame">
        <div class="search-result-list-container">
          <mu-grid-list class="gridlist">
            <mu-grid-tile v-for="video, index in searchResultList" :key="index">
              <img :src="video.modifiedImg" @click="jumpToVideoDetail(video)"/>
              <span slot="title" @click="jumpToVideoDetail(video)">{{video.title}}</span>
              <span slot="subTitle" @click="jumpToVideoDetail(video)"><b>{{video.short_title}}</b></span>
            </mu-grid-tile>
            <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMoreSearchResult"/>
          </mu-grid-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueLoading from 'vue-loading-template'
import { getIqiyiResponse } from '@/api'
import { saveSearchRecord, getSearchRecord, deleteSingleSearchRecord } from '@/database'
import * as types from '@/vuex/mutation-types'
import { mapState } from 'vuex'

export default {
  name: 'search',
  data () {
    return {
      loadingBar: false,
      searchQuery: '',
      pageNum: 1,
      scroller: null,
      searchResultList: [],
      showRecord: false,
      searchRecordList: [],
      loading: false
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.auth.user.nickname
    })
  },
  components: {
    vueLoading
  },
  methods: {
    showRecordAction () {
      getSearchRecord(this.nickname).then(recordList => {
        this.searchRecordList = recordList
      })
      this.showRecord = true
    },
    hideRecordAction () {
      this.showRecord = false
    },
    deleteRecord (record) {
      // const that = this
      deleteSingleSearchRecord(record.nickname, record.keyword).then(this.showRecordAction)
    },
    goBack () {
      window.history.go(-1)
    },
    fetchSearchResult (pageNum) {
      if (utils.isEmpty(this.searchQuery)) {
        return Promise.reject('empty')
      }
      this.showRecord = false
      if (pageNum === 1) {
        this.loadingBar = true
      }
      return getIqiyiResponse('search', {
        key: this.searchQuery,
        from: 'mobile_list',
        pg_num: pageNum,
        page_size: 30
      }).then(response => {
        this.loadingBar = false
        saveSearchRecord({nickname: this.nickname, keyword: this.searchQuery, time: new Date()})
        if (response.code === 100002) {
          return Promise.reject(response.errorReason)
        } else {
          const searchResultList = response.data.map(video => {
            video.modifiedImg = utils.handleImgUrl(video.img, '480_270')
            return video
          })
          return Promise.resolve(searchResultList)
        }
      }).catch(error => {
        this.loadingBar = false
        return Promise.reject(error)
      })
    },
    searchOperation: _.debounce(function () {
      this.fetchSearchResult(this.pageNum).then(response => {
        this.searchResultList = response
      }).catch(error => {
        if (error !== 'empty') {
          utils.showToast(error.toString())
        }
      })
    }, 1000),
    fetchMoreSearchResult () {
      this.fetchSearchResult(++this.pageNum).then(response => {
        this.searchResultList = this.searchResultList.concat(response)
        this.loading = false
      }).catch(error => {
        this.loading = false
        utils.showToast(error.toString())
      })
    },
    loadMoreSearchResult () {
      this.loading = true
      this.fetchMoreSearchResult()
    },
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
  watch: {
    searchQuery () {
      this.searchOperation()
    }
  },
  created () {
    getSearchRecord(this.nickname).then(recordList => {
      this.searchRecordList = recordList
    })
  },
  mounted () {
    this.scroller = this.$el
  }
}
</script>

<style lang="less">
  #search {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .appbar-search-field{
      color: #FFF;
      margin-bottom: 0;
      &.focus-state {
        color: #FFF;
      }
      .mu-text-field-hint {
        color: fade(#FFF, 54%);
      }
      .mu-text-field-input {
        color: #FFF;
      }
      .mu-text-field-focus-line {
        background-color: #FFF;
      }
    }
    .record-chip {
      margin: 4px;
    }
    .search-frame {
      margin-top: 20px;
      width: 90%;
      margin: 20px auto 0 auto;
      text-align: center;
      .search-result-list-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }
    }
  }
</style>

