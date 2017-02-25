import { LOGGER } from '~/common/const'


const positionRe = /\n\u001b\[1m(\d+)\u001b\[22m\u001b\[1m:(\d+)\u001b/g


export default {
  error(message, { filename = '', relative } = {}) {
    let logMessage = message

    if (relative) {
      const replacer = (match, line, column) =>
        `\n\u001b[1m${Number(line) + relative.line}\u001b[22m\u001b[1m:${Number(column) + relative.column}\u001b`

      logMessage = message.replace(positionRe, replacer)
    }

    console.log(`${LOGGER.ERROR_ID}:${filename}`, logMessage)
  },
}
