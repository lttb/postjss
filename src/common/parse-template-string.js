import stripIndent from 'strip-indent'
import escapeStringRegexp from 'escape-string-regexp'

import getUniqHash from './utils/get-uniq-hash'


const VAR = `$^var__${getUniqHash()}`
const VAR_ESCAPED = escapeStringRegexp(VAR)

const placeholderRe = new RegExp(`:?(.*?)${VAR_ESCAPED}(.*?):?`, 'g')


export default async ({ strings, values, from, processCSS }) => {
  const data = stripIndent(strings.join(VAR)).trim().concat('\n')

  const { styles } = await processCSS({ data, from })

  let index = 0

  const getVal = (val) => {
    const [match, left, right] = (val.match(placeholderRe) || [])

    if (!match) {
      return val
    }

    const body = values[index]
    index += 1

    return (left || right) && typeof body !== 'function'
      ? left + body + right
      : body
  }

  const transform = css => Object.entries(css)
    .reduce((acc, [key, value]) => {
      const prop = getVal(key.replace(/^\./, ''))

      const val = typeof value === 'object'
        ? transform(value)
        : getVal(value)

      return { ...acc, [prop]: val }
    }, {})

  return transform(styles)
}
