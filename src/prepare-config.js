import R from 'ramda'

import initCSSProcessor from './init-processor'
import initStyleGetter from './init-style-getter'
import requireModule from './utils/require-module'


const init = R.compose(
  initStyleGetter,
  initCSSProcessor,
  R.merge({
    plugins: {
      'postcss-import': {},
      'postcss-mixins': {},
      'postcss-advanced-variables': {},
      'postcss-custom-selectors': {},
      'postcss-custom-properties': {},
    },
    syntax: 'sugarss',
  }),
)


export default ({ postcss, extensionsRe = /^\..*\.(c|(s[ac]?))ss$/ }) => ({
  processCSS: R.compose(
    init(postcss),
    requireModule,
  ),
  extensionsRe: new RegExp(extensionsRe, 'i'),
})
