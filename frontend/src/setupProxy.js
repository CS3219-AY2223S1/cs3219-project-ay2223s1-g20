import { URI_USER_SVC, URI_MATCHING_SVC } from "./util/configs";

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/user', {
      target: URI_USER_SVC, // User Service
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
      target: URI_MATCHING_SVC, // Matching Service
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