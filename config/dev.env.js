'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"//api.ares.test.gongxiangdiancan.com"',
  UPLOAD_URL: '"//uploads.test.gongxiangdiancan.com"'
})
