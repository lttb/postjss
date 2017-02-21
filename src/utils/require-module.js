import fs from 'fs'
import path from 'path'
import resolveFrom from 'resolve-from'


export default (sourceModule, requireModulePath) =>
  fs.readFileSync(resolveFrom(
    path.dirname(sourceModule),
    requireModulePath,
  ))
