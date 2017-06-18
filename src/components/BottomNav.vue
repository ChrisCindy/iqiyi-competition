<template>
  <div class="bottom-nav is-fixed-bottom">
    <mu-bottom-nav :value="bottomNav" @change="handleChange">
      <mu-bottom-nav-item value="explore" title="发现" icon="explore" to="/explore" activeClass="mu-bottom-item-active"></mu-bottom-nav-item>
      <mu-bottom-nav-item value="follow" title="关注" icon="tv" to="/follow"  activeClass="mu-bottom-item-active"></mu-bottom-nav-item>
      <mu-bottom-nav-item value="account" title="我" icon="account_circle" to="/account" activeClass="mu-bottom-item-active"></mu-bottom-nav-item>
    </mu-bottom-nav>
  </div>
</template>

<script>
export default {
  name: 'bottom-nav',
  data () {
    return {
      bottomNav: ''
    }
  },
  methods: {
    handleChange (val) {
      // this.bottomNav = val
    }
  }
}
</script>

<style lang="less">
  .bottom-nav{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
</style>

