import postcss from 'postcss'
import postcssJs from 'postcss-js'
import postcssrc from 'postcss-load-config'


export default getPorcessor => postcssrc()
  .then(({ plugins, options }) => {
    const css = postcss(plugins)

    getPorcessor(null, ({ from, data }) => cb =>
      css.process(data, { ...options, from })
        .then(res => cb(null, postcssJs.objectify(res.root))))
  })
