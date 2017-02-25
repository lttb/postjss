import deasync from 'deasync'

import LogCatcher from '~/common/utils/log-catcher'

import initPropsParser from './init-props-parser'

import PostJSSError from './utils/postjss-error'
import getUniqHash from './utils/get-uniq-hash'


export default parseStyles => (params) => {
  const logCatcher = new LogCatcher(console, 'log')
  let parsedStyles

  try {
    // eg postcss-report reports messages into console.log, so we need catch them
    logCatcher.start()

    parsedStyles = deasync(parseStyles(params))()
  } catch (e) {
    throw new PostJSSError(e.message, logCatcher.messages)
  } finally {
    logCatcher.done()
  }

  const { 'defaults:': defaults, ...styles } = parsedStyles

  const argsName = getUniqHash()
  const parseProps = initPropsParser(argsName)

  return `(${argsName}) => {
    ${argsName} = Object.assign(${parseProps(defaults)}, ${argsName});
    return ${parseProps(styles)}
  }`
}
