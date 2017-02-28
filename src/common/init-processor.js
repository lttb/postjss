import postcss from 'postcss'
import postcssJs from 'postcss-js'
import postcssrc from 'postcss-load-config'


export default () =>
  postcssrc()
    .then(({ plugins, options }) => {
      const css = postcss(plugins)

      const cssProcessor = ({ from, data }) =>
        css.process(data, { ...options, from })
          .then(res => postcssJs.objectify(res.root))

      return cssProcessor
    })
