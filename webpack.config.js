// webpack.config.js
var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: "./src/TDMap.js",
  output: {
    filename: "TDMap.js",
    path: path.resolve(__dirname, "dist")
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 100
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }, {
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    }]
  },
  plugins: []
};