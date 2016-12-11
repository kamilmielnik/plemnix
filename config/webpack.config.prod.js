const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
  app: path.resolve(__dirname, '../src/js'),
  styles: path.resolve(__dirname, '../src/styles'),
  images: path.resolve(__dirname, '../src/images'),
  build: path.resolve(__dirname, '../build')
};

const sassLoaders = [
  'css-loader?sourceMap',
  'postcss-loader',
  'sass-loader?outputStyle=compressed'
];

const commonConfig = ({ isClient }) => ({
  stats: {
    colors: true
  },
  resolve: {
    root: PATHS.app,
    modulesDirectories: ['node_modules'],
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
        loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader?limit=8192&name=images/[name].[ext]?[hash]'
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader?limit=8192&name=fonts/[name].[ext]?[hash]'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: PATHS.images,
        to: 'images'
      }
    ]),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __CLIENT__: isClient,
      __SERVER__: !isClient,
      __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('css/app.css', { allChunks: true })
  ],
  postcss: () => [
    autoprefixer({
      browsers: ['> 0.1%']
    })
  ],
  devtool: 'source-map'
});

module.exports = [
  Object.assign({}, commonConfig({ isClient: true }), {
    name: 'client',
    entry: path.resolve(PATHS.app, 'client.js'),
    target: 'web',
    output: {
      path: PATHS.build,
      filename: 'js/client.js',
      publicPath: '/'
    }
  }),
  Object.assign({}, commonConfig({ isClient: false }), {
    name: 'server',
    entry: path.resolve(PATHS.app, 'server.js'),
    target: 'node',
    output: {
      path: PATHS.build,
      filename: 'js/server.js',
      publicPath: '/'
    }
  })
];
