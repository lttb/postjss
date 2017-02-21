import R from 'ramda'

import postcssJs from 'postcss-js'
import postcss from 'postcss'


const getPlugins = R.compose(
  R.map(R.apply(R.uncurryN(2, require))),
  R.toPairs,
)

const processCSS = R.compose(
  postcss,
  getPlugins,
)

export default ({ plugins, syntax }) => {
  const parser = require(syntax)

  return data => cb =>
    processCSS(plugins).process(data, { parser })
      .then(res => cb(null, postcssJs.objectify(res.root)))
}
