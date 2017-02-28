import prepareConfigSync from '~/common/prepare-config-sync'
import initParser from './init-parser'


const { processCSS } = prepareConfigSync()


export default initParser(processCSS)
