'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://platform.test.gongxiangdiancan.com"',
  UPLOAD_URL: '"http://uploads.test.gongxiangdiancan.com"'
})
