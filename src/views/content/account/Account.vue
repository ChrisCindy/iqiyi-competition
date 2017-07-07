<template>
  <div id="account">
    <mu-appbar title="我" titleClass="center-block">
    </mu-appbar>
    <mobile-sheet>
      <mu-list>
        <mu-list-item :title="nickname" disabled>
          <label for="uploadAvatar" slot="leftAvatar">
            <input type="file" id="uploadAvatar" @change="loadImageFile">
            <mu-avatar v-if="!customAvatar" icon="face"></mu-avatar>
            <mu-avatar v-else :src="avatarImg" />
          </label>         
        </mu-list-item>
      </mu-list>
      <mu-divider />
      <mu-list>
        <mu-list-item title="浏览记录" :to="{name: 'browsing-history'}">
          <mu-icon slot="right" value="navigate_next"/>
        </mu-list-item>
      </mu-list>
      <mu-divider />
      <mu-list>
        <mu-sub-header>设置</mu-sub-header>
        <mu-list-item title="修改密码" @click="jumpToChangePwd">
          <mu-icon slot="right" value="navigate_next"/>
        </mu-list-item>
        <mu-list-item disableRipple @click="toggleNightMode()" title="夜间模式">
          <mu-switch v-model="nightMode"  slot="right"/>
        </mu-list-item>
      </mu-list>
      <mu-divider />
      <mu-list>
        <mu-sub-header>关于</mu-sub-header>
        <mu-list-item disableRipple title="版本" afterText="1.0.0">
        </mu-list-item>
        <mu-list-item title="帮助反馈" href="mailto: yxy0919@foxmail.com">
          <mu-icon slot="right" value="navigate_next"/>
        </mu-list-item>

      </mu-list>
      <mu-divider />
      <mu-list>
        <mu-list-item disableRipple>
          <mu-raised-button @click="openConfirmSheet" label="退出登录" fullWidth secondary/>
        </mu-list-item>
      </mu-list>
    </mobile-sheet>
    <mu-bottom-sheet v-if="confirmSheet" :open="confirmSheet" @close="closeConfirmSheet">
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
import {saveUserAvatar, getUserAvatar} from '@/database'

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
      confirmSheet: false,
      customAvatar: false,
      avatarImg: ''
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.auth.user.nickname
    })
  },
  methods: {
    loadImageFile () {
      const oFReader = new FileReader()
      /* eslint-disable no-useless-escape */
      const rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i

      oFReader.onload = (oFREvent) => {
        this.customAvatar = true
        this.avatarImg = oFREvent.target.result
        saveUserAvatar(this.nickname, this.avatarImg)
      }

      const uploadAvatar = document.getElementById('uploadAvatar')
      if (uploadAvatar.files.length === 0) {
        return
      }
      const oFile = uploadAvatar.files[0]
      if (!rFilter.test(oFile.type)) {
        utils.showToast('请选择有效的图片文件!')
        return
      }
      oFReader.readAsDataURL(oFile)
    },
    jumpToChangePwd () {
      this.$store.commit(types.UPDATE_CHANGE_PWD_NICKNAME, {
        changePwdNickname: this.nickname
      })
      this.$router.push({
        name: 'secret-question'
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
  created () {
    getUserAvatar(this.nickname).then(avatarImg => {
      if (avatarImg) {
        this.customAvatar = true
        this.avatarImg = avatarImg
      }
    })
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

<style lang="less">
#account {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 56px;
  #uploadAvatar {
    position: absolute;
    width: 0px;
    height: 0px;
    outline:none;
  }
}
</style>

