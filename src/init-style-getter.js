import deasync from 'deasync'

import initPropsParser from './init-props-parser'
import getUniqHash from './utils/get-uniq-hash'


export default parseStyles => (css) => {
  const { 'defaults:': defaults, ...styles } = deasync(parseStyles(css))()

  const argsName = getUniqHash()
  const parseProps = initPropsParser(argsName)

  return `(${argsName}) => {
    ${argsName} = Object.assign(${parseProps(defaults)}, ${argsName});
    return ${parseProps(styles)}
  }`
}
