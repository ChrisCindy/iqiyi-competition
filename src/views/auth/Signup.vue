<template>
  <div id="signup">
    <div class="logo">
      <img src="../../assets/images/iqiyi-lite.png" alt="">
    </div>
    <div class="container">
      <mu-text-field hintText="请输入昵称" type="text" v-model="nickname" icon="person" :errorText="nicknameInputError"></mu-text-field>
      <mu-text-field hintText="请输入密码" type="password" v-model="password" icon="lock" :errorText="pwdInputError"></mu-text-field>
      <div>
        <mu-raised-button :disabled="banClick" primary @click="signup">注册</mu-raised-button>
      </div>
      <div class="login-tip">
        <router-link :to="{name: 'login'}">已有帐号</router-link>
        <span>|</span>
        <router-link :to="{name: 'retrieve-password'}">忘记密码</router-link>        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'signup',
  data () {
    return {
      nickname: '',
      password: '',
      nicknameInputError: '',
      pwdInputError: '',
      banClick: false
    }
  },
  methods: {
    signup () {
      if (utils.isEmpty(this.nickname)) {
        this.nicknameInputError = '请输入昵称'
        return
      }
      if (utils.isEmpty(this.password)) {
        this.pwdInputError = '请输入密码'
        return
      }
      this.$auth.signup({
        nickname: this.nickname,
        password: this.password
      }).then(result => {
        this.banClick = true
        utils.showToast('注册成功', 1000)
        setTimeout(() => {
          this.$router.push({ name: 'login' })
        }, 1000)
      }).catch(() => {
        utils.showToast('注册失败，已存在相同用户名')
      })
    }
  }
}
</script>

<style lang="less">
  #signup {
    width: 100%;
    height: 100%;
    // background: #FFF url(../../assets/images/wallpaper.jpg) 0% 0% / 100% no-repeat;
    // opacity: 0.5;
    .logo {
      display: flex;
      justify-content: center;
      padding-top: 60px;
    }
    .container{
      // height: 100%;
      // background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 60px;
      .login-tip {
        margin-top: 20px;
        font-size: 12px;
      }
    }
  }
</style>
