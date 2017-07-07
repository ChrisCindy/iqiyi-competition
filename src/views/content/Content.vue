<template>
  <div>
    <div class="loading-bar" v-show="isLoading">
      <mu-linear-progress :size="3" color="#009688" />
    </div>
    <router-view></router-view>
    <bottom-nav></bottom-nav>
  </div>
</template>

<script>
import vueLoading from 'vue-loading-template'
import { mapState } from 'vuex'
import BottomNav from '@/components/BottomNav'
export default {
  name: 'content',
  components: {
    vueLoading,
    BottomNav
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      isLoading: state => state.loading.isLoading
    })
  },
  methods: {
  }
}
</script>

<style lang="less">
</style>
