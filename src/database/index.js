import Dexie from 'dexie'
import md5 from 'md5'

const db = new Dexie('myiqiyi')

db.version(1).stores({
  user: 'nickname, password, questionType, answer, avatar',
  channel: 'id, name, desc, datetime',
  track: '[id+nickname], id, nickname, title, short_title, img, sns_score, play_count_text, a_id, tv_id, type, p_type, date_format, total_num, update_num',
  favorite: '[id+nickname], id, nickname, title, short_title, img, sns_score, play_count_text, a_id, tv_id, type, p_type, date_format, total_num, update_num',
  card: 'id, datetime, title, short_title, img, sns_score, play_count_text, a_id, tv_id, type, p_type, date_format, total_num, update_num',
  searchRecord: '[nickname+keyword], keyword, nickname, time',
  history: '[id+nickname], id, nickname, time, title, short_title, img, sns_score, play_count_text, a_id, tv_id, type, p_type, date_format, total_num, update_num'
})

// User
export function saveUser (nickname, password, questionType, answer) {
  return db.user.add({nickname, password: md5(password), questionType: questionType, answer: answer}).then(id => {
    return Promise.resolve(id)
  }).catch(error => {
    return Promise.reject(error)
  })
}

export function saveUserAvatar (nickname, image) {
  return db.user.update(nickname, {avatar: image}).then(id => {
    return Promise.resolve(id)
  }).catch(error => {
    return Promise.reject(error)
  })
}

export function getUserAvatar (nickname) {
  return db.user
    .where('nickname')
    .equals(nickname)
    .toArray(users => {
      return Promise.resolve(users[0].avatar)
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

export function validateQuestionAnswer (nickname, questionType, answer) {
  return db.user
    .where('nickname').equals(nickname)
    .and(user => {
      return user.questionType === questionType && user.answer === answer
    })
    .count(count => {
      if (count === 1) {
        return true
      } else {
        return false
      }
    })
}

export function changeUserPwd (nickname, newPassword) {
  return db.user.put({nickname, password: md5(newPassword)}).then(id => {
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

// Search record
export function saveSearchRecord (record) {
  return db.searchRecord.add(record).then(id => {
    return Promise.resolve(id)
  }).catch(() => {
    return db.searchRecord.update([record.id, record.nickname], record)
  })
}

export function getSearchRecord (nickname) {
  return db.searchRecord
    .where('nickname')
    .equals(nickname)
    .reverse()
    .sortBy('time', recordList => {
      if (recordList.length <= 10) {
        return Promise.resolve(recordList)
      } else {
        const firstTenRecordList = recordList.slice(0, 10)
        return Promise.resolve(firstTenRecordList)
      }
    }).catch(error => {
      return Promise.reject(error)
    })
}

export function deleteSingleSearchRecord (nickname, keyword) {
  return db.searchRecord
    .where('[nickname+keyword]')
    .equals([nickname, keyword])
    .delete()
    .then(deletedCount => {
      return Promise.resolve(deletedCount)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

export function deleteSearchRecord (nickname) {
  return db.searchRecord
    .where('nickname')
    .equals(nickname)
    .delete()
    .then(deletedCount => {
      return Promise.resolve(deletedCount)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

// history
export function saveHistoryVideo (video) {
  return db.history.add(video).then(id => {
    return Promise.resolve(id)
  }).catch(() => {
    return db.history.update([video.id, video.nickname], video)
  })
}

export function getHistoryVideo (nickname) {
  return db.history
    .where('nickname')
    .equals(nickname)
    .reverse()
    .sortBy('time', videos => {
      return Promise.resolve(videos)
    }).catch(error => {
      return Promise.reject(error)
    })
}

export function deleteHistoryVideo (videoId, nickname) {
  return db.history
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
