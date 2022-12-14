const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const PATHS = {
  app: path.resolve(__dirname, '../src/js'),
  styles: path.resolve(__dirname, '../src/styles'),
  build: path.resolve(__dirname, '../build')
};

const sassLoaders = [
  'style-loader',
  'css-loader',
  'postcss-loader',
  'sass-loader?outputStyle=expanded'
];

module.exports = {
  env: process.env.NODE_ENV,
  entry: {
    client: path.resolve(PATHS.app, 'client.js')
  },
  node: {
    fs: 'empty',
    tls: 'empty'
  },
  output: {
    path: PATHS.build,
    filename: 'js/[name].js',
    publicPath: '/'
  },
  stats: {
    colors: true,
    reasons: true
  },
  resolve: {
    root: PATHS.app,
    extensions: ['', '.js', '.jsx', '.scss']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: PATHS.app
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.scss$/,
        loader: sassLoaders.join('!')
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
      __CLIENT__: true,
      __SERVER__: false
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  postcss: () => [
    autoprefixer({
      browsers: ['> 0.1%']
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, '../src'),
    port: 3000,
    historyApiFallback: true
  },
  devtool: 'cheap-source-map'
};
