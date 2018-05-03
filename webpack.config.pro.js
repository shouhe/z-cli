var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var theme = require('./theme');
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
            chunks: [item.name]
        });
        data.push(_Plugin);
    })
    return data;
}

var entrys = getEntrys();
var tplDirs = getDirectory('./views');
var pluginList = getPlugin(tplDirs);


module.exports = {
    entry: entrys,

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name]/[name]-[hash].js",
        publicPath: "/dist",  //相当于打包时给静态资源加了一个前缀
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
        ]
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

    externals: {
        'redux': 'Redux',
        'react-dom': 'ReactDOM',
        'react-router': 'ReactRouter'
    },


    devtool: "source-map",

    context: __dirname,

    target: "web",

    stats: "errors-only",

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new CleanWebpackPlugin(['./dist']),
        new webpack.optimize.UglifyJsPlugin(
            {
                noConsole: true
            }
        )
        // new webpack.optimize.CommonsChunkPlugin({
        //   name: 'common',
        //   filename: "common.js",

        // })
    ].concat(pluginList),
}
