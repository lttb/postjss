const propsValueRe = /"[\w-]+":"\/(.*?)\/"/g

const propsValueJSRe = /"\/(.*?)\/"/g
const propsValueJSVarRe = /(.*?)\^(\w+)(.*?)/g

const propsNameRe = /"--\^([\w-]+):?":/g

// TODO: for css custom properties, make it better
const clearRe = /"'(.*?)'"/g


export default params => (props = {}) => JSON.stringify(props)
  .replace(propsValueRe, match =>
    match
      .replace(propsValueJSRe, '$1')
      .replace(propsValueJSVarRe, `$1${params}.$2$3`))
  .replace(propsNameRe, `[${params}.$1]:`)
  .replace(clearRe, '"$1"')
