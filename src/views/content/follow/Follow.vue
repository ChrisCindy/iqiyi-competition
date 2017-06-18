<template>
  <div>
    <mu-tabs :value="activeTab" @change="handleTabChange">
      <mu-tab value="tab1" title="追剧" href="#/follow/track"/>
      <mu-tab value="tab2" title="收藏" href="#/follow/favorite"/>
    </mu-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'follow',
  data () {
    return {
      activeTab: 'tab1'
    }
  },
  methods: {
    handleTabChange (val) {
      this.activeTab = val
    }
  }
}
</script>

