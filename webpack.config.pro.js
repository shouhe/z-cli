var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin =require('clean-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
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
      _file.js = file.replace(/tpl/, 'js');
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
      files: {
        filename: item.filename,
        template: item.template,
        js:  [item.js]
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
    path: path.resolve(__dirname, "dist"), 
    filename: "[name]-[hash].js", 
    publicPath: "/dist/", 
    library: "library", 
    libraryTarget: "umd", 
  },

  module: {
    // 关于模块配置

    rules: [
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
          "dot-loader"
        ]
      }
    ],

    /* 高级模块配置（点击展示） */
  },

  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ],
    extensions: [".js", ".json", ".jsx", ".css"],

    alias: {
      'Common': './src/common'
    },
  },


  devtool: "source-map", // enum
  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  // 牺牲了构建速度的 `source-map' 是最详细的。

  context: __dirname, 

  target: "web", // 枚举

  stats: "errors-only",
  
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new CleanWebpackPlugin(['./dist']),
    new webpack.optimize.UglifyJsPlugin(),
  ].concat(pluginList),
}
