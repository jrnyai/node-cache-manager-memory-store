
export default class MemoryClient {
  constructor (options) {
    this.options = options
    this.data = {}
    this.Promise = options.promiseDependency || global.Promise
  }

  get (key, options, cb) {
    if (typeof options === 'function') {
      cb = options
    }
    return new this.Promise((resolve, reject) => {
      var callback = (err, result) => {
        (err ? reject(err) : resolve(result))
        cb(err, result)
      }
      callback(null, this.data[key] || null)
    })
  }

  set (key, value, options, cb) {
    if (typeof options === 'function') {
      cb = options
    }
    return new this.Promise((resolve, reject) => {
      var callback = (err, result) => {
        (err ? reject(err) : resolve(result))
        cb(err, result)
      }
      this.data[key] = value
      callback(null, true)
    })
  }

  del (key, options, cb) {
    if (typeof options === 'function') {
      cb = options
    }

    return new this.Promise((resolve, reject) => {
      var callback = (err, result) => {
        (err ? reject(err) : resolve(result))
        cb(err, result)
      }
      if (this.data[key]) {
        delete this.data[key]
      }

      callback(null, null)
    })
  }

  reset (cb) {
    if (typeof cb !== 'function') {
      cb = function () {}
    }
    return new this.Promise((resolve, reject) => {
      var callback = (err, result) => {
        (err ? reject(err) : resolve(result))
        cb(err, result)
      }

      this.data = {}

      callback(null, null)
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
      client: this
    })
  }

  keys (pattern, cb) {
    if (typeof cb !== 'function') {
      cb = function () {}
    }
    return new this.Promise((resolve, reject) => {
      var callback = (err, result) => {
        (err ? reject(err) : resolve(result))
        cb(err, result)
      }
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

        callback(null, matches)
      }
      callback(null, keys)
    })
  }
}
