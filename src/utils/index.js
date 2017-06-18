/**
 * @export
 * @param {Any} value
 * @returns {Boolean}
 */

export function isEmpty (value) {
  if (Array.isArray(value)) {
    return !value.length
  }

  if (value === undefined || value === null || value === false) {
    return true
  }

  return !String(value).trim().length
}

/**
 * @export
 * @param {Array} array
 * @returns {Array}
 */
export function randomArray (array) {
  let index = 0
  let temp
  const length = array.length
  const randomArr = array.slice(0)
  for (let i = 1; i <= length; i++) {
    index = parseInt(Math.random() * (length - i)) + i
    if (index !== i) {
      temp = randomArr[i]
      randomArr[i] = randomArr[index]
      randomArr[index] = temp
    }
  }
  return randomArr
}

/**
 * @export
 * @param {String} imgUrl
 * @param {String} size
 * @returns {String}
 */

export function handleImgUrl (imgUrl, size = '480_360') {
  const imgRegExp = /^(.*)(.jpg|.png|.jpeg|.gif)$/
  const matchArr = imgRegExp.exec(imgUrl)
  const finalImgUrl = matchArr[1] + '_' + size + matchArr[2] + '?sign=iqiyi'
  return finalImgUrl
}

import * as types from '@/vuex/mutation-types'
import store from '@/vuex'
/**
 * @export
 * @param {String} message
 * @param {Number} [time=2000]
 */

export function showToast (message, time = 2000) {
  store.commit(types.UPDATE_TOAST, {
    showToast: true,
    toastMessage: message
  })
  store.dispatch(types.UPDATE_TOAST, {
    time: time
  })
}

const filmSlogan = [
  '“电影制作是一个经历多种人生的机会。    —— Robert Altman”',
  '“好电影应该在你每次重复观赏时都依然感觉新颖。    —— Roger Ebert”',
  '“电影是世界上最美的骗局。    —— Jean-Luc Godard”',
  '“好电影应该让你忘记自己身处于影院内。    —— Roman Polanski”',
  '“所有人生的谜语都可以从电影找到答案。    —— Steve Martin”',
  '“我相信电影可以有百万种不一样的主观见解。    —— Oliver Stone”',
  '“我们就是电影；电影就是我们。    —— David Ansen”',
  '“梦想始于剧本，而终结于电影。    —— George Lucas”'
]
const teleplaySlogan = [
  '“一千个追剧星人，可能有一万种妖娆的姿势。”',
  '“诸剧来袭，叫我如何不追剧？”',
  '“人生不能追剧，还有什么意义？”',
  '“如果明天是世界末日，你还要跟我一起追剧吗？”',
  '“最近你追剧了吗？”',
  '“听说爱追剧的人，长的都很好看。”',
  '“追剧是一件有情怀的事。”',
  '“话不多说，我要去追剧了。”'
]

/**
 * @export
 * @param {String} type
 * @returns {String}
 */

export function getRandomSlogan (type) {
  const num = Math.floor(Math.random() * 8)
  if (type === 'film') {
    return filmSlogan[num]
  } else {
    return teleplaySlogan[num]
  }
}
