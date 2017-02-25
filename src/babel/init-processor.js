import postcss from 'postcss'
import postcssJs from 'postcss-js'
import postcssrc from 'postcss-load-config'


export default processorCallback =>
  postcssrc()
    .then(({ plugins, options }) => {
      const css = postcss(plugins)

      const cssProcessor = ({ from, data }) => stylesCallback =>
        css.process(data, { ...options, from })
          .then(res => stylesCallback(null, postcssJs.objectify(res.root)))
          .catch(stylesCallback)

      processorCallback(null, cssProcessor)
    })
    .catch(processorCallback)
