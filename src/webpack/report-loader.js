import LogCatcher from '~/common/utils/log-catcher'
import { LOGGER } from '~/common/const'

const logger = new LogCatcher(console, 'log')
logger.start()


export default function (source) {
  this.cacheable()

  const messages = logger.messages

  messages.forEach((message, index) => {
    if (message.startsWith(LOGGER.ERROR_ID)) {
      const messageIndex = message.indexOf(this.resource)

      if (messageIndex) {
        this.emitError(message.slice(messageIndex + this.resource.length).trim().concat('\n'))
        delete messages[index]
      }
    } else {
      logger.log(...[].concat(message))
      delete messages[index]
    }
  })

  return source
}
