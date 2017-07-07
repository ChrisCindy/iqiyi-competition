<template>
  <div id="secret-question">
    <mu-appbar title="找回密码" titleClass="center-block">
      <mu-flat-button slot="left" @click="goBack" label="返回" icon="navigate_before" primary/>
      <mu-flat-button slot="right"  labelPosition="before" @click="goBackHome" label="主页" icon="home" primary />
    </mu-appbar>
    <div class="container">
      <mu-text-field :hintText="nickname" disabled type="text" icon="person"></mu-text-field>
      <mu-select-field v-model="questionType" hintText="请选择密保问题" icon="help" :errorText="questionInputError">
        <mu-menu-item value="1" title="你最崇拜的明星？"/>
        <mu-menu-item value="2" title="你最重要的朋友？"/>
        <mu-menu-item value="3" title="你最喜欢的城市？"/>
      </mu-select-field>
      <mu-text-field hintText="请输入密保问题答案" type="text" v-model="answer" icon="question_answer" :errorText="answerInputError"></mu-text-field>
      <div>
        <mu-raised-button :disabled="banClick" primary @click="confirmQuestionAnswer">验证</mu-raised-button>
      </div>
    </div>
  </div>
</template>

<script>
import { validateQuestionAnswer } from '@/database'
import { mapState } from 'vuex'

export default {
  name: 'secret-question',
  data () {
    return {
      questionType: '',
      answer: '',
      questionInputError: '',
      answerInputError: '',
      banClick: false
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.auth.changePwdNickname
    })
  },
  methods: {
    goBack () {
      window.history.go(-1)
    },
    goBackHome () {
      this.$router.push({
        name: 'track'
      })
    },
    confirmQuestionAnswer () {
      if (this.validateInput()) {
        validateQuestionAnswer(this.nickname, this.questionType, this.answer).then((result) => {
          if (result) {
            this.banClick = true
            utils.showToast('密保问题验证成功')
            setTimeout(() => {
              this.$router.push({ name: 'change-password' })
            }, 1000)
          } else {
            utils.showToast('密保问题验证失败，请检查后重新输入')
          }
        })
      }
    },
    validateInput () {
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
#secret-question {
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
