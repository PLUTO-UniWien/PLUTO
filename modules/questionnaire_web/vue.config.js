const Dotenv = require('dotenv-webpack');

module.exports = {
  publicPath: './',
  css: {
    loaderOptions: {
      css: {
        url: false,
      }
    }
  },
  configureWebpack: {
    plugins: [
      new Dotenv()
    ]
  },
  chainWebpack: config => {
    config
        .plugin('html')
        .tap(args => {
          args[0].title = "PLUTO - Public Value Assessment Tool";
          return args;
        })
  }
}