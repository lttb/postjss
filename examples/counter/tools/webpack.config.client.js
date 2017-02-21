const R = require('ramda')
const path = require('path')
const webpack = require('webpack')

const common = require('./webpack.common')


const PATHS = {
  app: path.resolve(__dirname, '../src/client'),
  dist: path.resolve(__dirname, '../dist'),
}

const { conf } = common({ PATHS })

const plugins = R.over(R.lensProp('plugins'), R.concat([
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
]))

const rules = R.view(R.lensPath(['module', 'rules']))

const rest = R.merge({
  entry: {
    app: path.join(PATHS.app, 'index.jsx'),
  },
  output: {
    path: PATHS.dist,
    filename: '[name].js',
  },
})


module.exports = R.compose(rest, plugins, rules)(conf)
