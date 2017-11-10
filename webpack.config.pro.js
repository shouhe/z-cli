var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin =require('clean-webpack-plugin');
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: "./src/main", // string | object | array
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
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/pages/index.tpl'
    }),
    new webpack.optimize.UglifyJsPlugin(),
    
  ]
}
