const R = require('ramda')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = require('./webpack.common')


const PORT = 3000

const PATHS = {
  app: path.resolve(__dirname, '../src/client'),
  build: path.resolve(__dirname, '../build'),
}

const { conf } = common({ PATHS })

const plugins = R.over(R.lensProp('plugins'), R.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
  new HtmlWebpackPlugin({
    inject: true,
    minify: {
      preserveLineBreaks: true,
      collapseWhitespace: true,
    },
    template: 'src/client/templates/client.pug',
    filename: 'index.html',
  }),
  new webpack.NamedModulesPlugin(),
]))

const rules = R.over(
  R.lensPath(['module', 'rules']),
  R.concat([{
    test: /\.pug$/,
    loader: 'pug-loader',
  }])
)

const rest = R.merge({
  entry: [
    `webpack-dev-server/client?http://localhost:${PORT}`,
    'webpack/hot/only-dev-server',

    path.join(PATHS.app, 'index.jsx'),
  ],
  output: {
    path: PATHS.build,
    filename: 'js/bundle.js',
    publicPath: '/',
  },
  devServer: {
    contentBase: PATHS.app,
    port: PORT,
    historyApiFallback: true,
    hot: true,

    stats: 'errors-only',
  },

  performance: {
    hints: false,
  },
})


module.exports = R.compose(plugins, rules, rest)(conf)
