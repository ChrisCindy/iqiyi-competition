<template>
  <div id="app">
    <div class="loading-bar" v-show="isLoading">
      <mu-linear-progress color="#FFFFFF" />
    </div>
    <keep-alive include="search">
      <router-view></router-view> 
    </keep-alive>
    <mu-toast v-if="showToast" :message="toastMessage" @close="hideToast"/>   
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as types from '@/vuex/mutation-types'

export default {
  name: 'app',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      isLoading: state => state.loading.isLoading,
      showToast: state => state.toast.showToast,
      toastMessage: state => state.toast.toastMessage
    })
  },
  methods: {
    hideToast () {
      this.$store.commit(types.UPDATE_TOAST, {
        showToast: false,
        toastMessage: ''
      })
    }
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;

  .loading-bar {
    position: fixed;
    top: 0;
    width: 100%;
  }
}
</style>
