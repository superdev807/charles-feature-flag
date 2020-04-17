const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ReplacePlugin = require('webpack-plugin-replace')
const LoadablePlugin = require('@loadable/webpack-plugin')

const srcPath = path.join(__dirname, 'source')
const distPath = path.join(__dirname, 'dist')
const entry = path.join(srcPath, 'client.tsx')
const indexHtml = path.join(srcPath, 'index.ejs')

const BUILD_ENV = process.env.BUILD_ENV || 'development'
const isProduction = BUILD_ENV === 'production'
const port = process.env.PORT || 8082

const isDocker = hasDockerEnv() || hasDockerCGroup()

module.exports = {
  target: 'web',
  entry: isProduction ? [entry] : [`react-hot-loader/patch`, entry],
  externals: {
    // Ignore server only dependencies
    basichtml: 'basichtml',
    '@peculiar/webcrypto': 'crypto',
    'css-mediaquery': 'matchMedia',
  },
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'eval',
  output: {
    filename: isProduction ? '[name].bundle.[contenthash].js' : '[name].bundle.js',
    chunkFilename: isProduction ? '[name].bundle.[contenthash].js' : '[name].bundle.js',
    path: distPath,
    publicPath: '/',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isProduction ? `[name].[contenthash].css` : `[name].css`
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: indexHtml,
      hash: isProduction,
    }),
    new ReplacePlugin({
      values: {
        // Ensures only browser-requirements are included
        [`typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined'`]: true,
        [`typeof window !== 'undefined' && typeof document !== 'undefined'`]: true,
        [`typeof crypto !== 'undefined'`]: true,
      },
    }),
    new webpack.EnvironmentPlugin({
      API_DOMAIN: isProduction ? 'api.olla.co' : isDocker ? '0.0.0.0:9999' : 'localhost:8000',
      API_PORT: isProduction ? '443' : '9999',
      NODE_ENV: process.env.NODE_ENV || 'development',
      BUILD_ENV,
      COMPANION_URL: isProduction ? 'https://upload.olla.co' : `http://localhost:${port}`,
      IMAGEKIT_URL: process.env.IMAGEKIT_URL || 'ik.imagekit.io/qxmwvn2y0qb'
    }),
    isProduction ? null : new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    new LoadablePlugin(),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: [
          isProduction ? null : {
            loader: 'thread-loader', // Don't use thread-loader in CircleCI it seems to fail often
          },
          {
            loader: 'babel-loader',
          },
          isProduction ? null : {
            loader: 'eslint-loader',
            options: {
              fix: true,
              failOnError: true,
            }
          }
        ].filter(Boolean),
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
              hmr: !isProduction,
              reloadAll: true,
            },
          },
          'css-loader'
        ],
      },
    ]
  },
  devServer: {
    host: '0.0.0.0',
    port,
    contentBase: distPath,
    historyApiFallback: true,
    compress: true,
    watchContentBase: true,
    disableHostCheck: true,
    hot: true,
  },
  resolve: {
    mainFields: !isProduction ? ['main'] : ['module', 'jsnext:main', 'browser', 'main'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
    alias: isProduction ? {} : { 'react-dom': '@hot-loader/react-dom' },
  },
  optimization: isProduction ? {
    concatenateModules: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new TerserJSPlugin({
        terserOptions: {
          sourceMap: true,
          parallel: true,
          ecma: undefined,
          compress: true,
          output: {
            comments: false,
            beautify: false
          }
        }
      }),
    ],
  } : void 0,
}

function hasDockerEnv() {
  try {
    fs.statSync('/.dockerenv')
    return true
  } catch (_) {
    return false
  }
}

function hasDockerCGroup() {
  try {
    return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker')
  } catch (_) {
    return false
  }
}
