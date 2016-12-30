var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var htmlWebpackPlugin = require('html-webpack-plugin');
var utils = require('./lib/utils');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var CleanPlugin = require('clean-webpack-plugin');
var openBrowserWebpackPlugin = require('open-browser-webpack-plugin');

var getEntry = utils.getEntry;
var fullPath = utils.fullPath;

// 项目根路径
var ROOT_PATH = fullPath('../');
// 开发路径
var SRC_PATH = ROOT_PATH + '/src';
// 编译路径
var DIST_PATH = ROOT_PATH + '/dist';

//是否是开发环境
var ENV = process.env.NODE_ENV !== 'production';

var config = {
    devtool: 'eval-source-map',
    entry: {},
    output: {
        path: './dist',
        filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.js[x]?$/,
          exclude: /node_modules/,
          loaders: ['babel']
        },
        {
          test: /\.(css|scss)$/,
          exclude: /node_modules/,
          loader: ExtractTextPlugin.extract('style', 'css', 'sass', 'postcss')
        },
        {
          test: /\.(?:jpg|png|gif|svg)$/,
          loaders: [
            'url?limit=8000&name=[hash].[ext]',
            'image-webpack'
          ]
        }
      ]
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.scss', '.css']
    },
    plugins: [
      new ExtractTextPlugin('[name].css')
    ],
    postcss: function() {
      return [precss, autoprefixer];
    }
    
}

// 获取所页面入口js文件
var jsEntry = getEntry(SRC_PATH + '/js/*.js');
config.entry = jsEntry;

// 编译所有html
var htmlEntry = getEntry(SRC_PATH + '/*.html');
var htmlPlugins = [];
for(var i in htmlEntry) {
  var hwp = new htmlWebpackPlugin({
    title: i,
    filename: i + '.html',
    chunks: [i],
    template: htmlEntry[i],
    inject: true,
    hash: true,//为静态资源生成hash值，可以实现缓存
    minify: {
        removeComments: true,//移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
    }
  })
  config.plugins.unshift(hwp);
}

// 开发环境配置添加本地服务器
if (ENV) {
  /*config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );*/
  config.plugins.push(
    new openBrowserWebpackPlugin({ url: 'http://localhost:8080' })
  );
  config.derServer = {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    colors: true,
    contentBase: './dist'
  }
} else {
  // 编译前先清空dist目录
  config.plugins.push(
    new CleanPlugin(['dist'])
  );
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
          warnings: false
      }
    })
  );  
}

module.exports = config;