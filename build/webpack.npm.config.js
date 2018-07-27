const config = require("../config");
const path = require("path");
const vueLoaderConfig = require("./vue-loader.conf");
const utils = require("./utils");

const fs = require("fs");

const entry = {};
const files = fs.readdirSync(resolve("./src/plugins"));

files.forEach(file => {
    const id = file.match(/^(\w+)/)[1];
    entry[id] = resolve("./src/plugins/" + file);
});

function resolve(dir) {
    return path.join(__dirname, "..", dir);
}
const npmConfig={
    context: path.resolve(__dirname, "../"),
    entry: {
        form: "./index.js",
        ...entry
    },
    output: {
        path: config.build.assetsRoot,
        filename: "[name].js",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {            
            vue$: "vue/dist/vue.esm.js",
            "@": resolve("src")
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
    externals: ["vue", /^element-ui\//, "vuex"],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [
                    resolve("src/components"),
                    resolve("src/mixins"),
                    resolve("src/*.js"),
                    resolve("test"),
                    resolve("node_modules/webpack-dev-server/client")
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
                }
            },
            {
                test: /\.less$/,
                loader: "style!css!less"
            },
            ...utils.styleLoaders({
                sourceMap: config.dev.cssSourceMap,
                usePostCSS: true
            })
        ]
    }
};
module.exports = [{
    ...npmConfig,
    entry: {
        form: "./index.js",  
        plugins: "./src/plugins.js",      
    },
    output: {
        path: resolve("./libs"),
        filename: "[name].js",
        libraryTarget: "umd"
    },
}];
