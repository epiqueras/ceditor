const webpack = require('webpack');
const path = require('path');
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const config = {
  entry: ['webpack-dev-server/client?http://localhost:8080', 'webpack/hot/only-dev-server', './src/index.js'],

  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel-loader'],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules(?!\/highlight.js)(?!\/fullpage.js)/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg|eot|woff|ttf|svg|woff2)$/,
        loader: 'file-loader',
      },
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'), // eslint-disable-line quote-props
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new StyleLintPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => module.context && module.context.indexOf('node_modules') !== -1,
    }),
  ],

  eslint: {
    configFile: './.eslintrc',
  },
};

config.target = webpackTargetElectronRenderer(config);
module.exports = config;
