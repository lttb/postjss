import fs from 'fs'
import path from 'path'
import resolveFrom from 'resolve-from'


export default (sourceModule, requireModulePath) => {
  const from = resolveFrom(
    path.dirname(sourceModule),
    requireModulePath,
  )

  const data = fs.readFileSync(from)

  return { from, data }
}
