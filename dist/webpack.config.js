"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mode = void 0;
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
const webpack_merge_1 = require("webpack-merge");
const isDev = process.env.NODE_ENV !== 'production';
exports.mode = isDev ? 'development' : 'production';
const commonConfig = {
    mode: exports.mode,
    entry: ['./client/static/index.js'],
    resolve: {
        extensions: ['.js', '.elm'],
    },
    module: {
        noParse: /\.elm$/,
    },
    output: {
        filename: '[name].js',
        path: path_1.default.resolve(__dirname, 'dist/public'),
        publicPath: '/',
    },
    plugins: [
        new html_webpack_plugin_1.default({
            template: './client/static/index.html',
            filename: 'index.html',
            inject: 'body',
        }),
    ],
};
const devConfig = {
    devtool: 'cheap-module-source-map',
    entry: ['webpack-hot-middleware/client?path=/__webpack_hmr'],
    module: {},
    plugins: [new webpack_1.default.HotModuleReplacementPlugin()],
};
const prodConfig = {
    module: {},
    plugins: [new mini_css_extract_plugin_1.default()],
};
exports.default = (0, webpack_merge_1.merge)(commonConfig, isDev ? devConfig : prodConfig);
//# sourceMappingURL=webpack.config.js.map