const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/user', {
      target: 'http://localhost:8000', // User Service
      changeOrigin: true,
      pathRewrite: {
        '^/user': ''
      },
      headers: {
        Connection: 'keep-alive'
      }
    })
  )
  app.use(
    createProxyMiddleware('/matching', {
      target: 'http://localhost:8001', // Matching Service
      changeOrigin: true,
      pathRewrite: {
        '^/matching': ''
      },
      headers: {
        Connection: 'keep-alive'
      }
    })
  )
  app.use(
    createProxyMiddleware('/collab', {
      target: 'http://localhost:8002', // Collaboration Service
      changeOrigin: true,
      pathRewrite: {
        '^/collab': ''
      },
      headers: {
        Connection: 'keep-alive'
      }
    })
  )
}
