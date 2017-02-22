import R from 'ramda'
import deasync from 'deasync'

import initCSSProcessor from './init-processor'
import initStyleGetter from './init-style-getter'
import requireModule from './utils/require-module'


const init = R.compose(
  initStyleGetter,
  deasync(initCSSProcessor),
)


export default ({ extensionsRe = /\.(c|(s[ac]?))ss$/ }) => ({
  processCSS: R.compose(
    init(),
    requireModule,
  ),
  extensionsRe: new RegExp(extensionsRe, 'i'),
})
