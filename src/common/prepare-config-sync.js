import R from 'ramda'
import deasync from 'deasync'

import { CONFIG } from './const'

import initCSSProcessor from './init-processor'
import initStyleGetter from './init-style-getter'
import parseTemplateString from './parse-template-string'

import PostJSSError from './utils/postjss-error'


const init = R.compose(
  initStyleGetter,
  deasync(cb => initCSSProcessor()
    .then(data => cb(null, data))
    .catch(cb)),
)

let processCSS

try {
  processCSS = init()
} catch (e) {
  throw new PostJSSError(e.message)
}


export default ({
  extensionsRe = CONFIG.extensionsRe,
  namespace = CONFIG.namespace,
  throwError = CONFIG.throwError,
  modules = CONFIG.modules,
} = {}) => ({
  modules,
  namespace,
  throwError,
  extensionsRe: new RegExp(extensionsRe, 'i'),
  processCSS: deasync((data, cb) => processCSS(data)
    .then(result => cb(null, result))
    .catch(cb)),

  parseTemplateString: deasync((data, cb) => parseTemplateString(data)
    .then(result => cb(null, result))
    .catch(cb)),
})
