import parseTemplateString from '~/common/parse-template-string'
import prepareConfigSync from '~/babel/prepare-config'

import prepareConfig from './prepare-config'


export const postjssAsync = prepareConfig().then((config) => {
  const { processCSS } = config()

  return (strings, ...values) =>
    parseTemplateString({ strings, values, processCSS })
})


export default () => {
  const { processCSS } = prepareConfigSync()

  return (strings, ...values) =>
    parseTemplateString({ strings, values, processCSS })
}
