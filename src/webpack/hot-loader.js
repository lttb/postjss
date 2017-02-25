import path from 'path'
import resolveFrom from 'resolve-from'


const preapreRe = ({ extensions = '(c|(s[ac]?))ss' }) => {
  const filename = `[\`'"](.*?\\.${extensions})`

  return {
    importRe: new RegExp(`(?:require\\(|import[\\w\\s]+from)\\s*${filename}`, 'g'),
    filenameRe: new RegExp(filename),
  }
}

let cache


export default function (source) {
  this.cacheable()

  if (!cache) {
    cache = preapreRe(this.query)
  }

  const { importRe, filenameRe } = cache

  const getStylesPath = filepath =>
    resolveFrom(path.dirname(this.resource), filepath)

  ;(source.match(importRe) || [])
    .map(file => getStylesPath(file.match(filenameRe)[1]))
    .filter(Boolean)
    .forEach(this.dependency)

  return source
}
