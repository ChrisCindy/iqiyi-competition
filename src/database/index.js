import Dexie from 'dexie'
import md5 from 'md5'

const db = new Dexie('myiqiyi')

db.version(1).stores({
  user: 'nickname, password',
  channel: 'id, name, desc, datetime',
  track: '[id+nickname], id, nickname, title, short_title, img, sns_score, play_count_text, a_id, tv_id, type, p_type, date_format, total_num, update_num',
  favorite: '[id+nickname], id, nickname, title, short_title, img, sns_score, play_count_text, a_id, tv_id, type, p_type, date_format, total_num, update_num',
  card: 'id, datetime, title, short_title, img, sns_score, play_count_text, a_id, tv_id, type, p_type, date_format, total_num, update_num'
})

// User
export function saveUser (nickname, password) {
  return db.user.add({nickname: nickname, password: md5(password)}).then(id => {
    return Promise.resolve(id)
  }).catch(error => {
    return Promise.reject(error)
  })
}

export function validateUser (nickname, password) {
  return db.user
    .where('nickname').equals(nickname)
    .and(user => {
      return user.password === md5(password)
    })
    .count(count => {
      if (count === 1) {
        return true
      } else {
        return false
      }
    })
}

export function validateNickname (nickname) {
  return db.user
    .where('nickname').equals(nickname)
    .count(count => {
      if (count === 1) {
        return true
      } else {
        return false
      }
    })
}

export function changeUserPwd (nickname, newPassword) {
  return db.user.put({nickname: nickname, password: md5(newPassword)}).then(id => {
    return Promise.resolve(id)
  }).catch(error => {
    return Promise.reject(error)
  })
}

// Channel
export function saveChannelListToDB (channelList) {
  return db.channel.bulkPut(channelList).then(id => {
    return Promise.resolve(id)
  }).catch(error => {
    return Promise.reject(error)
  })
}

export function getChannelListFromDB () {
  return db.channel
    .toArray(channelList => {
      return Promise.resolve(channelList)
    }).catch(error => {
      return Promise.reject(error)
    })
}

// Follow
export function saveFollowVideo (type, video) {
  return db[type].add(video).then(id => {
    return Promise.resolve(id)
  }).catch(error => {
    return Promise.reject(error)
  })
}

export function deleteFollowVideo (type, videoId, nickname) {
  return db[type]
    .where('[id+nickname]')
    .equals([videoId, nickname])
    .delete()
    .then(deletedCount => {
      return Promise.resolve(deletedCount)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

export function isInCollection (type, videoId, nickname) {
  return db[type]
    .where('[id+nickname]')
    .equals([videoId, nickname])
    .count(count => {
      if (count) {
        return true
      }
      return false
    })
}

export function getFollowVideo (type, nickname) {
  return db[type]
    .where('nickname')
    .equals(nickname)
    .toArray(videos => {
      return Promise.resolve(videos)
    }).catch(error => {
      return Promise.reject(error)
    })
}

// Card
export function saveCardToDB (cardList) {
  return db.card.bulkPut(cardList).then(id => {
    return Promise.resolve(id)
  }).catch(error => {
    return Promise.reject(error)
  })
}

export function getCardFromDB () {
  return db.card
    .toArray(cardList => {
      return Promise.resolve(cardList)
    }).catch(error => {
      return Promise.reject(error)
    })
}
