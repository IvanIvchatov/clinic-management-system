module.exports = {
  devServer: {
    port: 8081,
    // API requests go through the dev server -> no CORS issues
    proxy: {
      '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true }
    }
  }
}
