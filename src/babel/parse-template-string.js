import stripIndent from 'strip-indent'
import escapeStringRegexp from 'escape-string-regexp'

import getUniqHash from './utils/get-uniq-hash'


const EDGE = `__EDGE__${getUniqHash()}`

const VAR = `$^var__${getUniqHash()}`
const VAR_ESCAPED = escapeStringRegexp(VAR)

const placeholderRe = new RegExp(`:?(.*?)${VAR_ESCAPED}(.*?):?`, 'g')

const placeholderPropRe = new RegExp(`"([^"]*${VAR_ESCAPED}[^"]*)":`, 'g')
const placeholderValRe = new RegExp(`:"([^"]*${VAR_ESCAPED}[^"]*)"`, 'g')

const valEdgePlaceholderRe = new RegExp(`:${EDGE}(.*?)${EDGE}`, 'g')
const varEdgeRe = /^`\$\{(.*?)\}`$/


export default ({ strings, expressions, code, from, processCSS }) => {
  const data = stripIndent(strings.join(VAR))

  // wrap into IIFE
  const css = `(${processCSS({ data, from })})()`

  let index = 0

  return css
    .replace(placeholderPropRe, '[`$1`]:')
    .replace(placeholderValRe, `:${EDGE}\`$1\`${EDGE}`)
    .replace(placeholderRe, (match, left, right) => {
      const expr = expressions[index]
      index += 1

      const body = code.slice(expr.start, expr.end)

      return left || right ? `${left}$\{${body}}${right}` : body
    })
    .replace(valEdgePlaceholderRe, (match, val) => `:${val.replace(varEdgeRe, '$1')}`)
}

