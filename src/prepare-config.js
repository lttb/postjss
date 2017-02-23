import R from 'ramda'
import deasync from 'deasync'

import initCSSProcessor from './init-processor'
import initStyleGetter from './init-style-getter'


const init = R.compose(
  initStyleGetter,
  deasync(initCSSProcessor),
)


export default ({ extensionsRe = /\.(c|(s[ac]?))ss$/, namespace = 'prejss' }) => ({
  namespace,
  processCSS: init(),
  extensionsRe: new RegExp(extensionsRe, 'i'),
})
