import LogCatcher from './utils/log-catcher'
import PostJSSError from './utils/postjss-error'


export default parseStyles => (params) => {
  const logCatcher = new LogCatcher(console, 'log')

  logCatcher.start()

  return parseStyles(params)
    .then((parsedStyles) => {
      logCatcher.done()

      const { 'defaults:': defaults, ...styles } = parsedStyles

      return { styles, defaults }
    })
    .catch((e) => {
      throw new PostJSSError(e.message, logCatcher.done())
    })
}
