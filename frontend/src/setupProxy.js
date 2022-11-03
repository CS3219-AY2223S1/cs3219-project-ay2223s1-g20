const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/user', {
      target: process.env.REACT_APP_URI_USER_SVC || 'http://localhost:8000', // User Service
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
      target: process.env.REACT_APP_URI_MATCHING_SVC || 'http://localhost:8001', // Matching Service
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
      target: process.env.REACT_APP_URI_COLLAB_SVC || 'http://localhost:8002', // Collaboration Service
      changeOrigin: true,
      pathRewrite: {
        '^/collab': ''
      },
      headers: {
        Connection: 'keep-alive'
      }
    })
  )
  app.use(
    createProxyMiddleware('/question', {
      target: process.env.REACT_APP_URI_QUESTION_SVC || 'http://localhost:8003', // Question Service
      changeOrigin: true,
      pathRewrite: {
        '^/question': ''
      },
      headers: {
        Connection: 'keep-alive'
      }
    })
  )
  app.use(
    createProxyMiddleware('/chat', {
      target: 'http://localhost:8003', // Chat Service
      changeOrigin: true,
      pathRewrite: {
        '^/chat': ''
      },
      headers: {
        Connection: 'keep-alive'
      }
    })
  )
  app.use(
    createProxyMiddleware('/history', {
      target: 'http://localhost:8484', // History Service
      changeOrigin: true,
      pathRewrite: {
        '^/history': ''
      },
      headers: {
        Connection: 'keep-alive'
      }
    })
  )
}
