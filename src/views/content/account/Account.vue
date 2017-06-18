<template>
  <div id="account">
    <mu-appbar title="我" titleClass="center-block">
    </mu-appbar>
    <mobile-sheet>
      <mu-list>
        <mu-list-item :title="nickname" disabled>
          <mu-avatar icon="face" slot="leftAvatar"/>
        </mu-list-item>
      </mu-list>
      <mu-divider />
      <mu-list>
        <mu-sub-header>设置</mu-sub-header>
        <mu-list-item disableRipple title="修改密码" @click="jumpToChangePwd">
          <mu-icon slot="right" value="navigate_next"/>
        </mu-list-item>
        <mu-list-item disableRipple @click="toggleNightMode()" title="夜间模式">
          <mu-switch v-model="nightMode"  slot="right"/>
        </mu-list-item>
      </mu-list>
      <mu-divider />
      <mu-list>
        <mu-list-item disableRipple>
          <mu-raised-button @click="openConfirmSheet" label="退出登录" fullWidth secondary/>
        </mu-list-item>
      </mu-list>
    </mobile-sheet>
    <mu-bottom-sheet :open="confirmSheet" @close="closeConfirmSheet">
      <mu-list>
        <mu-sub-header class="center-block">
          确定退出登录吗？
        </mu-sub-header>
        <mu-list-item title="退出登录" @click="logout" :titleClass="['center-block','emphasis-color']"/>
        <mu-list-item title="取消" @click="closeConfirmSheet" titleClass="center-block"/>
      </mu-list>
    </mu-bottom-sheet>
  </div>
</template>

<script>
import MobileSheet from '@/components/MobileSheet'
import dark from '!raw-loader!muse-ui/dist/theme-dark.css'
import teal from '!raw-loader!muse-ui/dist/theme-teal.css'
import { mapState } from 'vuex'
import * as types from '@/vuex/mutation-types'

export default {
  name: 'account',
  components: {
    MobileSheet
  },
  data () {
    return {
      nightMode: this.$store.state.settings.nightMode,
      themes: {
        teal,
        dark
      },
      confirmSheet: false
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.auth.user.nickname
    })
  },
  methods: {
    jumpToChangePwd () {
      this.$store.commit(types.UPDATE_CHANGE_PWD_NICKNAME, {
        changePwdNickname: this.nickname
      })
      this.$router.push({
        name: 'change-password'
      })
    },
    toggleNightMode () {
      this.nightMode = !this.nightMode
    },
    getThemeStyle () {
      const themeId = 'muse-theme'
      let styleEl = document.getElementById(themeId)
      if (styleEl) {
        return styleEl
      }
      styleEl = document.createElement('style')
      styleEl.id = themeId
      document.head.appendChild(styleEl)
      return styleEl
    },
    openConfirmSheet () {
      this.confirmSheet = true
    },
    closeConfirmSheet () {
      this.confirmSheet = false
    },
    logout () {
      this.$auth.logout()
    }
  },
  watch: {
    nightMode () {
      const styleEl = this.getThemeStyle()
      styleEl.innerHTML = this.nightMode ? this.themes.dark : this.themes.teal
      this.$store.commit(types.UPDATE_SETTINGS_STATUS, {
        nightMode: this.nightMode
      })
    }
  }
}
</script>

