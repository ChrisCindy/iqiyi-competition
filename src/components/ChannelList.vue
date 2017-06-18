<template>
  <mu-drawer :open="open" width="30%" :docked="false" @close="toggle()">
    <mu-list>
      <mu-list-item v-for="channel in channelList" :title="channel.name" :key="channel.id" @click="jumpToChannelDetail(channel.name)">
      </mu-list-item>
    </mu-list>
  </mu-drawer>
</template>

<script>
import { getIqiyiResponse } from '@/api'
export default {
  name: 'channel-list',
  data () {
    return {
      channelList: []
    }
  },
  computed: {
    openChannelList () {
      return this.open
    }
  },
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    toggle () {
      this.openChannelList = !this.openChannelList
      this.$emit('update:open', this.openChannelList)
    },
    getChannelList () {
      getIqiyiResponse('channel', {
        type: 'list'
      }).then(response => {
        this.channelList = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    jumpToChannelDetail (channelName) {
      this.$router.push({
        name: 'channel-detail',
        params: {
          channelName: channelName
        }
      })
    }
  },
  created () {
    this.getChannelList()
  }
}
</script>
