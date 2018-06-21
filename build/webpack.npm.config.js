const config = require('../config')
const path = require('path');
const vueLoaderConfig = require('./vue-loader.conf')
const utils = require('./utils')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './index.js',
    },
    output: {
        path: config.build.assetsRoot,
        filename: 'form.js',
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
        }
    },
    // externals: function (context, request, callback) {
    //     if(request.match(/element-ui/)){

    //     }

    //     if (/^yourregex$/.test(request)) {
    //         return callback(null, 'commonjs ' + request);
    //     }
    //     callback();
    // },
    externals: {
        vue: {
            commonjs: 'lodash',
        },
        'element-ui':{
            commonjs: 'element-ui',
        }
        // 'element-ui': 'element-ui'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueLoaderConfig
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.less$/,
            loader: "style!css!less"
        }, ...utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })]
    }
}