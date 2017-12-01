var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin =require('clean-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
var fs = require('fs');

function getDirectory(relativePath) {
  let res = [];
  let root = path.resolve(__dirname, relativePath);

  let files = fs.readdirSync(root);

  files.forEach(function(file) {
    let path = `${root}/${file}`;
    let stat = fs.lstatSync(path);

    if (stat.isDirectory()) {
      res.push(file)
    } else {
      let _file = {};
      _file.filename =  file.replace(/tpl/, 'html');
      _file.template = path;
      _file.js = [ file.replace(/tpl/, 'js')];
      res.push(_file)
    }
  })
  return res;
}

function getEntrys() {
  let data = {};
  let dirs = getDirectory('./src/pages');

  dirs.forEach(function(item) {
    data[item] = `./src/pages/${item}/index.js`;
  });
  return data;
}

function getPlugin(tplDirs) {
  let data = [];
  tplDirs.forEach(function(item) {
    console.log(item.js);
    let _Plugin = new HtmlWebpackPlugin({
      filename: item.filename,
      template: item.template,
      files: {
        js:  [ item.js ]
      }
    });
    data.push(_Plugin);
  })
  return data;
}

var entrys = getEntrys();
var tplDirs = getDirectory('./views');
var pluginList = getPlugin(tplDirs);


module.exports = {
  entry: entrys, // string | object | array
  // 这里应用程序开始执行
  // webpack 开始打包

  output: {
    // webpack 如何输出结果的相关选项

    path: path.resolve(__dirname, "dist"), // string
    filename: "[name]-[hash].js", // string
    // 「入口分块(entry chunk)」的文件名模板（出口分块？）
    publicPath: "/", // string
    // 输出解析文件的目录，url 相对于 HTML 页面
    library: "library", // string,
    // 导出库(exported library)的名称
    libraryTarget: "umd", // 通用模块定义
    // 导出库(exported library)的类型
    /* 高级输出配置（点击显示） */
  },

  module: {
    // 关于模块配置

    rules: [
      // 模块规则（配置 loader、解析器等选项）

      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },

      {
        test: /\.tpl$/,
        use: [
          // 应用多个 loader 和选项
          "dot-loader"
        ]
      }
      // 条件不匹配时匹配
    ],

    /* 高级模块配置（点击展示） */
  },

  resolve: {
    // 解析模块请求的选项
    // （不适用于对 loader 解析）

    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ],

    extensions: [".js", ".json", ".jsx", ".css"],
    // 使用的扩展名
    alias: {
      'Common': './src/common'
    },
  },


  devtool: "source-map", // enum

  context: __dirname, // string（绝对路径！）
  // webpack 的主目录
  // entry 和 module.rules.loader 选项
  // 相对于此目录解析
  target: "web", // 枚举
  stats: "errors-only",
  
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ].concat(pluginList),

  devServer: {
    proxy: { // proxy URLs to backend development server
      '/api': 'http://localhost'
    },
    port: 9000,
    contentBase: path.join(__dirname, 'dist'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
  }
}
