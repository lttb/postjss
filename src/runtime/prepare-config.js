import R from 'ramda'

import { CONFIG } from '~/common/const'

import initCSSProcessor from '~/common/init-processor'
import initStyleGetter from '~/common/init-style-getter'

import PostJSSError from '~/common/utils/postjss-error'


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
    } = {}) => ({
      namespace,
      throwError,
      processCSS,
      extensionsRe: new RegExp(extensionsRe, 'i'),
    }))
  .catch(e => new PostJSSError(e))
