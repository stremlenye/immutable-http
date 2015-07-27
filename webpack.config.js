var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    'index': './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    library: 'immutable-http',
    libraryTarget: 'umd'
  },
  target: 'web',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          optional: ['runtime'],
          stage: 0
        }
      }
    ]
  }
};
