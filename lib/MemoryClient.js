let _Promise
export default class MemoryClient {
  constructor (options) {
    this.options = options
    this.data = {}
    _Promise = options.promiseDependency || global.Promise
  }

  get (key, options, cb) {
    if (typeof options === 'function') {
      cb = options
    }
    return new _Promise((resolve, reject) => {
      cb = cb || ((err, result) => (err ? reject(err) : resolve(result)))
      cb(null, this.data[key] || null)
    })
  }

  set (key, value, options, cb) {
    if (typeof options === 'function') {
      cb = options
    }
    return new _Promise((resolve, reject) => {
      cb = cb || ((err, result) => (err ? reject(err) : resolve(result)))
      this.data[key] = value
      cb(null, true)
    })
  }

  del (key, options, cb) {
    if (typeof options === 'function') {
      cb = options
    }

    return new _Promise((resolve, reject) => {
      cb = cb || ((err, result) => (err ? reject(err) : resolve(result)))
      if (this.data[key]) {
        delete this.data[key]
      }

      cb(null, null)
    })
  }

  reset (cb) {
    if (typeof cb !== 'function') {
      cb = function () {}
    }
    return new _Promise((resolve, reject) => {
      cb = cb || ((err, result) => (err ? reject(err) : resolve(result)))

      this.data = {}

      cb(null, null)
    })
  }

  isCacheableValue (value) {
    if (this.options.isCacheableValue) {
      return this.options.isCacheableValue(value)
    }

    return value !== null && value !== undefined
  }

  getClient (cb) {
    return cb(null, {
      client: this,
    })
  }

  keys (pattern, cb) {
    return new _Promise((resolve, reject) => {
      cb = cb || ((err, result) => (err ? reject(err) : resolve(result)))
      const keys = Object.keys(this.data)
      let checkPattern = true

      if (typeof pattern === 'function') {
        cb = pattern
        checkPattern = false
      }

      if (checkPattern) {
        const matches = []

        keys.forEach((key) => {
          if (key.includes(pattern)) {
            matches.push(key)
          }
        })

        cb(null, matches)
      }
      cb(null, keys)
    })
  }
}
