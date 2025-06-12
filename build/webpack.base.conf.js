//
//'use strict'
//const path = require('path')
//const utils = require('./utils')
//const config = require('../config')
//const vueLoaderConfig = require('./vue-loader.conf')
//const webpack = require('webpack')
//function resolve (dir) {
//  return path.join(__dirname, '..', dir)
//}
//
//const createLintingRule = () => ({
//  test: /\.(js|vue)$/,
//  loader: 'eslint-loader',
//  enforce: 'pre',
//  include: [resolve('src'), resolve('test')],
//  options: {
//    formatter: require('eslint-friendly-formatter'),
//    emitWarning: !config.dev.showEslintErrorsInOverlay
//  }
//})
//
//const { VueLoaderPlugin } = require('vue-loader')
//module.exports = {
//  context: path.resolve(__dirname, '../'),
//  entry: {
//    app: './src/main.js'
//  },
//  output: {
//    path: config.build.assetsRoot,
//    filename: '[name].js',
//    publicPath: process.env.NODE_ENV === 'production'
//      ? config.build.assetsPublicPath
//      : config.dev.assetsPublicPath
//  },
//  resolve: {
//    extensions: ['.js', '.vue', '.json'],
//    alias: {
//      'vue$': 'vue/dist/vue.esm.js',
//      '@': resolve('src'),
//    }
//  },
//  externals: {
//  },
//  module: {
//    rules: [
//      // ...(config.dev.useEslint ? [createLintingRule()] : []),
//      {
//        test: /\.vue$/,
//        loader: 'vue-loader',
//        options: vueLoaderConfig
//      },
//      {
//        test: /\.js$/,
//        loader: 'babel-loader',
//        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client'), resolve('node_modules/axios/lib')],
//        //exclude: /node_modules\/(?!axios)/,
//        options: {
//          //presets: ['es2015']
//        }
//      },
//      {
//        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
//        loader: 'url-loader',
//        options: {
//          limit: 10000,
//          name: utils.assetsPath('img/[name].[hash:7].[ext]')
//        }
//      },
//      {
//        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
//        loader: 'url-loader',
//        options: {
//          limit: 10000,
//          name: utils.assetsPath('media/[name].[hash:7].[ext]')
//        }
//      },
//      {
//        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
//        loader: 'url-loader',
//        options: {
//          limit: 10000,
//          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
//        }
//      },
//      // {
//      //   test: /\.less$/,
//      //   loader: 'style-loader!css-loader!less-loader'
//      // }
//    ]
//  },
//  plugins: [
//    new VueLoaderPlugin()
//  ],
//  node: {
//    // prevent webpack from injecting useless setImmediate polyfill because Vue
//    // source contains it (although only uses it if it's native).
//    setImmediate: false,
//    // prevent webpack from injecting mocks to Node native modules
//    // that does not make sense for the client
//    dgram: 'empty',
//    fs: 'empty',
//    net: 'empty',
//    tls: 'empty',
//    child_process: 'empty'
//  }
//}



'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 引入 UglifyJsPlugin
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

const { VueLoaderPlugin } = require('vue-loader')
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  externals: {
  },
  module: {
    rules: [
      // ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client'), resolve('node_modules/axios/lib')],
        options: {
          presets: ['@babel/preset-env'], // 使用 babel preset-env 转译代码
          plugins: ['@babel/plugin-transform-runtime'] // 转换 async/await
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      // {
      //   test: /\.less$/,
      //   loader: 'style-loader!css-loader!less-loader'
      // }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          ecma: 8, // 使 UglifyJS 支持 ES6/ES2017
          compress: {
            warnings: false,
          },
          output: {
            comments: false,
          },
        },
      }),
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
