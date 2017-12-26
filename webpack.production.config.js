// webpack.config.js
var path = require("path");
var webpack = require("webpack");
var UnminifiedWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: "./src/TDMap.js",
  output: {
    filename: 'TDMap.min.js',
    path: path.resolve(__dirname, "dist")
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
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};