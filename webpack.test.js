module.exports = {
  entry: './test.js',
  output: {
    // webpack 如何输出结果的相关选项

    path: path.resolve(__dirname, "dist"), // string
    filename: "[name]-[hash].js", // string
    // 「入口分块(entry chunk)」的文件名模板（出口分块？）
    publicPath: "/", // string
    library: "library", // string,
    libraryTarget: "umd", // 通用模块定义
  }

}