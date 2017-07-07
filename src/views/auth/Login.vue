<template>
  <div id="login">
    <div class="logo">
      <img src="../../assets/images/iqiyi-lite.png" alt="">
    </div>
    <div class="container">
      <mu-text-field hintText="请输入昵称" type="text" v-model="nickname" icon="person" :errorText="nicknameInputError"></mu-text-field>
      <mu-text-field hintText="请输入密码" type="password" v-model="password" icon="lock" :errorText="pwdInputError"></mu-text-field>
      <div class="login-btn">
        <mu-raised-button :disabled="banClick" primary @click="login">登录</mu-raised-button>
      </div>
      <div class="signup-tip">
        <router-link :to="{name: 'signup'}">新人注册</router-link>
        <span>|</span>
        <router-link :to="{name: 'retrieve-password'}">忘记密码</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
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
    login () {
      if (utils.isEmpty(this.nickname)) {
        this.nicknameInputError = '请输入昵称'
        return
      }
      if (utils.isEmpty(this.password)) {
        this.pwdInputError = '请输入密码'
        return
      }
      utils.showToast('登录成功', 1000)
      this.$auth.login({
        nickname: this.nickname,
        password: this.password
      }).then(result => {
        this.banClick = true
        utils.showToast('登录成功', 1000)
        const redirect = this.$route.query.redirect
        console.log(this.$route)
        if (redirect) {
          setTimeout(() => {
            this.$router.push({name: redirect})
          }, 1000)
        } else {
          setTimeout(() => {
            this.$router.push({name: 'content'})
          }, 1000)
        }
      }).catch(() => {
        utils.showToast('用户名或密码输入错误')
      })
    }
  }
}
</script>

<style lang="less">
  #login{
    width: 100%;
    height: 100%;
    .logo {
      display: flex;
      justify-content: center;
      padding-top: 60px;
    }
    .container{
      padding-top: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .login-btn {
        margin-top: 20px;
      }
      .signup-tip {
        margin-top: 20px;
        font-size: 12px;
      }
    }
  }
</style>
