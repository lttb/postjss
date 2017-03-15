import * as t from 'babel-types'


const propsValueJSRe = /\/[\S\s\n]*/
const propsValueJSVarRe = /([\S\s\n]*)\$\^(\w+)([\S\s\n]*)/

const propsNameRe = /\$\^([\w-]+)/


export default (argsName) => {
  const getVariable = (val) => {
    const [match] = (val.match(propsValueJSRe) || [])
    if (match) {
      const res = match.slice(1, -1).replace(propsValueJSVarRe, `$1${argsName}.$2$3`)

      return t.identifier(res)
    }

    return null
  }

  const getKey = (key) => {
    const variable = getVariable(key)

    if (variable) {
      return variable
    }

    const [, prop] = (key.match(propsNameRe) || [])

    if (!prop) {
      return t.StringLiteral(key)
    }

    return t.memberExpression(t.identifier(argsName), t.identifier(prop))
  }

  const getVal = (val) => {
    const variable = getVariable(val)

    if (variable) {
      return variable
    }

    return t.StringLiteral(val)
  }

  const transform = css => t.ObjectExpression(Object.entries(css)
    .map(([key, value]) => {
      const prop = getKey(key.replace(/^\./, ''))

      const val = typeof value === 'object'
        ? transform(value)
        : getVal(value)

      return t.objectProperty(prop, val, !t.isStringLiteral(prop))
    }))


  return ({ styles, defaults = {} }) => ({
    styles: transform(styles),
    defaults: transform(defaults),
  })
}
