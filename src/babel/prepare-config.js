import R from 'ramda'
import deasync from 'deasync'

import initCSSProcessor from './init-processor'
import initStyleGetter from './init-style-getter'

import PostJSSError from './utils/postjss-error'


const init = R.compose(
  initStyleGetter,
  deasync(initCSSProcessor),
)

let processCSS

try {
  processCSS = init()
} catch (e) {
  throw new PostJSSError(e.message)
}


export default ({
  extensionsRe = /\.(c|(s[ac]?))ss$/,
  namespace = 'postjss',
  throwError = false,
} = {}) => ({
  namespace,
  throwError,
  processCSS,
  extensionsRe: new RegExp(extensionsRe, 'i'),
})
