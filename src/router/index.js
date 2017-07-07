import Vue from 'vue'
import Router from 'vue-router'

import store from '../vuex'
import * as types from '@/vuex/mutation-types'

const Content = resolve => require(['@/views/content/Content'], resolve)

const Explore = resolve => require(['@/views/content/explore/Explore'], resolve)
const ChannelDetail = resolve => require(['@/views/content/explore/ChannelDetail'], resolve)

const Follow = resolve => require(['@/views/content/follow/Follow'], resolve)
const Track = resolve => require(['@/views/content/follow/Track'], resolve)
const Favorite = resolve => require(['@/views/content/follow/Favorite'], resolve)

const Search = resolve => require(['@/views/content/search/Search'], resolve)

const Account = resolve => require(['@/views/content/account/Account'], resolve)
const BrowsingHistory = resolve => require(['@/views/content/account/BrowsingHistory'], resolve)

const Signup = resolve => require(['@/views/auth/Signup'], resolve)
const Login = resolve => require(['@/views/auth/Login'], resolve)
const RetrievePassword = resolve => require(['@/views/auth/RetrievePassword'], resolve)
const SecretQuestion = resolve => require(['@/views/auth/SecretQuestion'], resolve)
const ChangePassword = resolve => require(['@/views/auth/ChangePassword'], resolve)

const VideoDetail = resolve => require(['@/views/common/VideoDetail'], resolve)

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    name: 'content',
    beforeEnter: guardRoute,
    component: Content,
    redirect: {
      name: 'follow'
    },
    children: [{
      path: 'explore',
      name: 'explore',
      component: Explore
    }, {
      path: 'follow',
      name: 'follow',
      component: Follow,
      redirect: {
        name: 'track'
      },
      children: [{
        path: 'track',
        name: 'track',
        component: Track
      }, {
        path: 'favorite',
        name: 'favorite',
        component: Favorite
      }]
    }, {
      path: 'account',
      name: 'account',
      component: Account
    }
    ]
  },
  {
    path: '/search',
    name: 'search',
    beforeEnter: guardRoute,
    component: Search
  },
  {
    path: '/browsing-history',
    name: 'browsing-history',
    component: BrowsingHistory
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/retrieve-password',
    name: 'retrieve-password',
    component: RetrievePassword
  },
  {
    path: '/secret-question',
    name: 'secret-question',
    component: SecretQuestion
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: ChangePassword
  },
  {
    path: '/channel-detail/:channelId',
    name: 'channel-detail',
    beforeEnter: guardRouteOfChannel,
    component: ChannelDetail
  },
  {
    path: '/video-detail/:videoId',
    name: 'video-detail',
    beforeEnter: guardRouteOfVideo,
    component: VideoDetail
  }
  ]
})

router.beforeEach((to, from, next) => {
  store.commit(types.UPDATE_LOADING_STATUS, {isLoading: true})
  next()
})

router.afterEach(to => {
  store.commit(types.UPDATE_LOADING_STATUS, {isLoading: false})
})

function guardRoute (to, from, next) {
  const auth = router.app.$options.store.state.auth
  if (!auth.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.name }
    })
  } else {
    next()
  }
}

function guardRouteOfChannel (to, from, next) {
  const ifChannelExisted = store.state.channel.channelId
  if (!ifChannelExisted) {
    next({
      path: '/login',
      query: { redirect: 'explore' }
    })
  } else {
    next()
  }
}

function guardRouteOfVideo (to, from, next) {
  const ifVideoExisted = store.state.video.detail.id
  if (!ifVideoExisted) {
    next({
      path: '/login',
      query: { redirect: 'explore' }
    })
  } else {
    next()
  }
}

export default router
