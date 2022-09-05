const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/user', {
      target: 'http://localhost:8000', // User Service
      changeOrigin: true,
      pathRewrite: {
        "^/user": "",
      },
      headers: {
        Connection: "keep-alive"
      }
    })
  );
  app.use(
    createProxyMiddleware('/matching', {
      target: 'http://localhost:4000', // Matching Service
      changeOrigin: true,
      pathRewrite: {
        "^/matching": "",
      },
      headers: {
        Connection: "keep-alive"
      }
    })
  );
}