import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import Path from 'path'
import Webpack, { Configuration } from 'webpack'
import { merge } from 'webpack-merge'

const isDev = process.env.NODE_ENV !== 'production'
export const mode = isDev ? 'development' : 'production'

const commonConfig: Configuration = {
  mode: mode,
  entry: ['./client/static/index.ts'],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.elm'],
  },
  module: {
    noParse: /\.elm$/,
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: ['ts-loader'],
      },
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: ['elm-hot-webpack-loader', 'elm-webpack-loader'],
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: Path.resolve(__dirname, 'dist/client'),
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/static/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
  ],
}

const devConfig: Configuration = {
  devtool: 'cheap-module-source-map',
  entry: ['webpack-hot-middleware/client?path=/__webpack_hmr'],
  module: {},
  plugins: [new Webpack.HotModuleReplacementPlugin()],
}

const prodConfig: Configuration = {
  module: {},
  plugins: [new MiniCssExtractPlugin()],
}

export default merge(commonConfig, isDev ? devConfig : prodConfig)
