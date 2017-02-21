import fs from 'fs'
import resolveFrom from 'resolve-from'


export default (sourceModuleDir, requireModulePath) =>
  fs.readFileSync(resolveFrom(sourceModuleDir, requireModulePath))
