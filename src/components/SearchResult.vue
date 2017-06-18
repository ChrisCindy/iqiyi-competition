<template>
  <div class="gridlist-container">
    <mu-grid-list class="gridlist">
      <mu-grid-tile v-for="tile, index in list" :key="index">
        <img :src="tile.modifiedImg"/>
        <span slot="title">{{tile.title}}</span>
        <span slot="subTitle"><b>{{tile.short_title}}</b></span>
      </mu-grid-tile>
    </mu-grid-list>
  </div>
</template>

<script>
export default {
  name: 'SearchResult',
  props: ['list']
}
</script>

<style lang="less">
  .gridlist-container{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
</style>
