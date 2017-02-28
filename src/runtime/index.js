import prepareConfig from '~/babel/prepare-config'
import parseTemplateString from '~/babel/parse-template-string'


const config = prepareConfig()

export default (strings, ...values) =>
  parseTemplateString({ strings, values, processCSS: config.processCSS })
