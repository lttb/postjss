import path from 'path'
import resolveFrom from 'resolve-from'


export const prepareRe = ({ extensions = '(c|(s[ac]?))ss' } = {}) => {
  const filename = `[\`'"](.*?\\.${extensions})`

  return {
    importRe: new RegExp(`(?:require\\(|import[\\w\\s]+from)\\s*${filename}`, 'g'),
    filenameRe: new RegExp(filename),
  }
}

export const initPrepareFiles = (options) => {
  const { importRe, filenameRe } = prepareRe(options)

  return source => (source.match(importRe) || [])
    .map(file => file.match(filenameRe)[1])
}


let prepareFiles


export default function (source) {
  this.cacheable()

  if (!prepareFiles) {
    prepareFiles = initPrepareFiles(this.query)
  }

  const getStylesPath = filepath =>
    resolveFrom(path.dirname(this.resource), filepath)

  prepareFiles(source)
    .map(getStylesPath)
    .filter(Boolean)
    .forEach(this.dependency)

  return source
}
