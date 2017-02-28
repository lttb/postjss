import deasync from 'deasync'

import LogCatcher from '~/common/utils/log-catcher'

import PostJSSError from './utils/postjss-error'


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

  return { styles, defaults }
}
