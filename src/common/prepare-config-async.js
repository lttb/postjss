import R from 'ramda'

import { CONFIG } from './const'

import initCSSProcessor from './init-processor'
import initStyleGetter from './init-style-getter'

import PostJSSError from './utils/postjss-error'


const init = R.composeP(
  initStyleGetter,
  initCSSProcessor,
)

export default () => init()
  .then(processCSS =>
    ({
      extensionsRe = CONFIG.extensionsRe,
      namespace = CONFIG.namespace,
      throwError = CONFIG.throwError,
      modules = CONFIG.modules,
    } = {}) => ({
      modules,
      namespace,
      throwError,
      processCSS,
      extensionsRe: new RegExp(extensionsRe, 'i'),
    }))
  .catch(e => new PostJSSError(e))
