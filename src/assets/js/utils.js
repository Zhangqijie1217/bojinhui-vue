export const TESTURL = '10.0.114.169:8080'

export const secret = 'bowebtest'

export const RESULT_CODE = '0000'

export function getUserUToken () {
  let _token = hasUToken()

  if (!_token) {
    _token = ''
  }

  return _token
}

export function hasUToken () {
  let res = getStorage('utoken')
  if (!res) {
    return false
  }
  return res
}

export function setStorage (key, value) {
  if ((!key && typeof key !== 'string') || !value) {
    return
  }

  return localStorage.setItem(key, value)
}

export function getStorage (key) {
  if (!key && typeof key !== 'string') {
    return
  }

  return localStorage.getItem(key)
}

export function removeStorage (key) {
  if (!key && typeof key !== 'string') {
    return
  }
  return localStorage.removeItem(key)
}
