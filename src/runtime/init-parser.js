import parseTemplateString from '~/common/parse-template-string'


export default processCSS => (strings, ...values) =>
  parseTemplateString({ strings, values, processCSS })
