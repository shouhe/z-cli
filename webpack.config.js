let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin =require('clean-webpack-plugin');
let path = require('path');
let webpack = require('webpack');
let fs = require('fs');

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
      _file.name =  file.replace(/.tpl/, '');
      _file.filename = file.replace(/.tpl/, '/') + 'index.html';
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
    let _Plugin = new HtmlWebpackPlugin({
      filename: item.filename,
      template: item.template,
      chunks: [item.name]
    });
    data.push(_Plugin);
  })
  return data;
}

let entrys = getEntrys();
let tplDirs = getDirectory('./views');
let pluginList = getPlugin(tplDirs);


module.exports = {
  entry: entrys, 

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-[hash].js", 
    publicPath: "/", 
    library: "library", 
    libraryTarget: "umd",
  },

  module: {

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
  externals: {
  },
  context: __dirname,
  target: "web", 
  stats: "errors-only",
  
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ].concat(pluginList),

  devServer: {
    proxy: { 
      '/api': 'http://localhost'
    },
    port: 9000,
    contentBase: path.join(__dirname, 'dist'), 
    compress: true, 
    historyApiFallback: true, 
    hot: true, 
    https: false, 
    noInfo: true
  }
}
