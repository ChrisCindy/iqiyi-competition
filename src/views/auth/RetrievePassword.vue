<template>
  <div id="retrieve-password">
    <div class="container">
      <mu-text-field hintText="请输入注册昵称" type="text" v-model="nickname" icon="person" :errorText="nicknameInputError"></mu-text-field>
      <div>
        <mu-raised-button primary @click="confirmNickname">确定</mu-raised-button>
      </div>
    </div>
  </div>
</template>

<script>
import { validateNickname } from '@/database'
import * as types from '@/vuex/mutation-types'

export default {
  name: 'retrieve-password',
  data () {
    return {
      nickname: '',
      nicknameInputError: ''
    }
  },
  methods: {
    confirmNickname () {
      if (utils.isEmpty(this.nickname)) {
        this.nicknameInputError = '请输入昵称'
        return
      }
      validateNickname(this.nickname).then(result => {
        if (result) {
          this.$store.commit(types.UPDATE_CHANGE_PWD_NICKNAME, {
            changePwdNickname: this.nickname
          })
          this.$router.push({
            name: 'change-password'
          })
        } else {
          this.nicknameInputError = '不存在此用户'
        }
      })
    }
  }
}
</script>

<style lang="less">
#retrieve-password {
  width: 100%;
  height: 100%;
  .container {
    padding-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
