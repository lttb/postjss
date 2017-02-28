import prepareConfig from '~/common/prepare-config-async'
import initParser from './init-parser'


export default prepareConfig().then((config) => {
  const { processCSS } = config()

  return initParser(processCSS)
})
