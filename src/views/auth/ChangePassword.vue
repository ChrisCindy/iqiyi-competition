<template>
  <div id="change-password">
    <div class="container">
      <mu-text-field :hintText="nickname" disabled type="text" icon="person"></mu-text-field>
      <mu-text-field hintText="请输入新密码" type="password" v-model="password" icon="lock" :errorText="pwdInputError"></mu-text-field>
      <div>
        <mu-raised-button primary @click="confirmChangePwd">确定修改</mu-raised-button>
      </div>
    </div>
  </div>
</template>

<script>
import { changeUserPwd } from '@/database'
import { mapState } from 'vuex'
export default {
  name: 'change-password',
  data () {
    return {
      password: '',
      pwdInputError: ''
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.auth.changePwdNickname
    })
  },
  methods: {
    confirmChangePwd () {
      changeUserPwd(this.nickname, this.password).then((result) => {
        utils.showToast('密码修改成功，请重新登录')
        this.$router.push({
          name: 'login'
        })
      }).catch(() => {
        utils.showToast('密码修改失败，请稍后重试')
      })
    }
  }
}
</script>

<style lang="less">
#change-password {
  .container {
    padding-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
