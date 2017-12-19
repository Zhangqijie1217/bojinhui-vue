const target = 'http://10.0.114.169:8080'

module.exports = {
  proxyMap: {
    '/apis': {
      target: 'http://10.0.114.169:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/'
      }
    }
  }
}
