import * as t from 'babel-types'


const propsValueJSRe = /\/.*?\//
const propsValueJSVarRe = /(.*?)\^(\w+)(.*?)/

const propsNameRe = /--\^([\w-]+)/


export default (argsName) => {
  const getKey = (key) => {
    const [match] = (key.match(propsValueJSRe) || [])
    if (match) {
      const res = match.slice(1, -1).replace(propsValueJSVarRe, `$1${argsName}.$2$3`)

      return t.identifier(res)
    }

    const [, prop] = (key.match(propsNameRe) || [])

    if (!prop) {
      return t.StringLiteral(key)
    }

    return t.memberExpression(t.identifier(argsName), prop)
  }

  const getVal = (val) => {
    const [match] = (val.match(propsValueJSRe) || [])

    if (!match) {
      return t.StringLiteral(val)
    }

    const res = match.slice(1, -1).replace(propsValueJSVarRe, `$1${argsName}.$2$3`)

    return t.identifier(res)
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
