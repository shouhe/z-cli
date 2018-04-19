let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let path = require('path');
let webpack = require('webpack');
let fs = require('fs');
let theme = require('./theme.js');
let autoprefixer =require('autoprefixer');
let rucksack = require('rucksack-css');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

console.log(theme);

function getDirectory(relativePath) {
    let res = [];
    let root = path.resolve(__dirname, relativePath);

    let files = fs.readdirSync(root);

    files.forEach(function (file) {
        let path = `${root}/${file}`;
        let stat = fs.lstatSync(path);

        if (stat.isDirectory()) {
            res.push(file)
        } else {
            let _file = {};
            _file.name = file.replace(/.tpl/, '');
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

    dirs.forEach(function (item) {
        data[item] = `./src/pages/${item}/index.js`;
    });
    return data;
}

function getPlugin(tplDirs) {
    let data = [];
    tplDirs.forEach(function (item) {
        let _Plugin = new HtmlWebpackPlugin({
            filename: item.filename,
            template: item.template,
            chunks: [item.name],
            publicPath: item.name
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

    devtool: 'inline-source-map',

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name]/[name]-[hash].js",
        publicPath: "http://localhost:9000/",
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
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: `css!postcss!less?{"sourceMap":true}`
            },
            {
                test: /\.less$/,
                include: path.resolve(__dirname, 'node_modules/antd'),
                loader: `style-loader!css-loader!less-loader?{"sourceMap":true, modifyVars: ${JSON.stringify(theme)}}`
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'node_modules/antd'),
                loader: "style-loader!css-loader"
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
        extensions: [".js", ".json", ".jsx", ".css", ".html"],
        alias: {
            'Common': './src/common'
        },
    },

    devtool: "source-map", // enum
    externals: {},
    context: __dirname,
    target: "web",
    stats: "errors-only",

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    rucksack(),
                    autoprefixer({
                        browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
                    }),
                ]
            }
        })
    ].concat(pluginList),

    devServer: {
        proxy: {
            "/api": {
                target: "http://localhost:80"
            },
            changeOrigin: true,
            router: {
                // when request.headers.host == 'dev.localhost:3000',
                // override target 'http://www.example.org' to 'http://localhost:8000'
            }
        },
        port: 9000,
        publicPath: '/', //dev sever路径 当前output目录 => dist
        disableHostCheck: true,
        index: 'index/index.html',
        contentBase: path.join(__dirname, "asset"), //提供查看静态资源的地址  localhost/asset就是当前工组目录
        compress: true,
        historyApiFallback: true,
        hot: true,
        https: false,
        noInfo: false,
        staticOptions: {
            redirect: true
        }
    }
}
