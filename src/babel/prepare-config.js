import R from 'ramda'
import deasync from 'deasync'

import { CONFIG } from '~/common/const'

import initCSSProcessor from '~/common/init-processor'
import initStyleGetter from '~/common/init-style-getter'
import parseTemplateString from '~/common/parse-template-string'

import PostJSSError from '~/common/utils/postjss-error'


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
} = {}) => ({
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
