<template>
  <div id="signup">
    <div class="logo">
      <img src="../../assets/images/iqiyi-lite.png" alt="">
    </div>
    <div class="container">
      <mu-text-field hintText="请输入昵称" type="text" v-model="nickname" icon="person" :errorText="nicknameInputError"></mu-text-field>
      <mu-text-field hintText="请输入密码" type="password" v-model="password" icon="lock" :errorText="pwdInputError"></mu-text-field>
      <mu-select-field v-model="questionType" hintText="请选择密保问题" icon="help" :errorText="questionInputError">
        <mu-menu-item value="1" title="你最崇拜的明星？"/>
        <mu-menu-item value="2" title="你最重要的朋友？"/>
        <mu-menu-item value="3" title="你最喜欢的城市？"/>
      </mu-select-field>
      <mu-text-field v-show="questionType" hintText="请输入密保问题答案" type="text" v-model="answer" icon="question_answer" :errorText="answerInputError"></mu-text-field>
      <div class="signup-btn">
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
      questionType: '',
      questionInputError: '',
      answer: '',
      answerInputError: '',
      banClick: false
    }
  },
  methods: {
    signup () {
      if (this.validateInput()) {
        this.$auth.signup({
          nickname: this.nickname,
          password: this.password,
          questionType: this.questionType,
          answer: this.answer
        }).then(result => {
          this.banClick = true
          utils.showToast('注册成功', 1000)
          setTimeout(() => {
            this.$router.push({ name: 'login' })
          }, 1000)
        }).catch((error) => {
          console.log(error)
          utils.showToast('注册失败，已存在相同用户名')
        })
      }
    },
    validateInput () {
      if (utils.isEmpty(this.nickname)) {
        this.nicknameInputError = '请输入昵称'
        return false
      } else {
        this.nicknameInputError = ''
      }
      if (utils.isEmpty(this.password)) {
        this.pwdInputError = '请输入密码'
        return false
      } else {
        this.pwdInputError = ''
      }
      if (utils.isEmpty(this.questionType)) {
        this.questionInputError = '请选择密保问题'
        return false
      } else {
        this.questionInputError = ''
      }
      if (utils.isEmpty(this.answer)) {
        this.answerInputError = '请输入密保问题答案'
        return false
      } else {
        this.answerInputError = ''
      }
      return true
    }
  }
}
</script>

<style lang="less">
  #signup {
    width: 100%;
    height: 100%;
    .logo {
      display: flex;
      justify-content: center;
      padding-top: 60px;
    }
    .container{
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 60px;
      .signup-btn {
        margin-top: 20px;
      }
      .login-tip {
        margin-top: 20px;
        font-size: 12px;
      }
    }
  }
</style>
