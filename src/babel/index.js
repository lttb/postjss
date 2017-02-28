import R from 'ramda'
import template from 'babel-template'

import prepareConfig from './prepare-config'

import Logger from './utils/logger'
import requireModule from './utils/require-module'
import getIndentNumber from './utils/get-indent-number'

import initPropsParser from './init-props-parser'

import getUniqHash from './utils/get-uniq-hash'


const argsName = getUniqHash()
const parseProps = initPropsParser(argsName)

const functionTemplate = template(`(function (${argsName} = {}) {
  ${argsName} = Object.assign(defaults, ${argsName});

  return styles;
});`)


export default ({ types: t }) => {
  let config
  let processCSSModule
  let requireCSSModule

  return {
    pre() {
      if (config) {
        return
      }

      config = prepareConfig(this.opts)
      processCSSModule = R.compose(
        functionTemplate,
        parseProps,
        config.processCSS,
        requireModule,
      )

      requireCSSModule = (filename, value) => {
        let res = t.arrayExpression()

        try {
          res = processCSSModule(filename, value)
        } catch (e) {
          if (config.throwError) {
            throw e
          } else {
            Logger.error(e.message, { filename })
          }
        }

        return res
      }
    },

    visitor: {
      ImportDefaultSpecifier(p, { file }) {
        const { value } = p.parentPath.node.source

        if (!config.extensionsRe.test(value)) {
          return
        }

        const filename = file.opts.filename

        p.parentPath.replaceWith(requireCSSModule(filename, value))

        p.parentPath.replaceWith(
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(p.node.local.name),
              t.toExpression(p.parentPath.node),
            ),
          ]))
      },

      CallExpression(p, { file }) {
        const { callee: { name: calleeName }, arguments: args } = p.node

        if (calleeName !== 'require' || !args.length || !t.isStringLiteral(args[0])) {
          return
        }

        const [{ value }] = args

        if (!config.extensionsRe.test(value)) {
          return
        }

        const filename = file.opts.filename

        p.replaceWith(requireCSSModule(filename, value))
      },

      TaggedTemplateExpression(p, { file }) {
        const { tag } = p.node

        if (tag.name !== config.namespace) {
          return
        }

        const filename = file.opts.filename

        const { quasis, expressions } = p.node.quasi
        const { code } = p.hub.file

        let res = t.ObjectExpression([])

        const strings = quasis.map(quasi => quasi.value.cooked)

        // match JS like PostJSS Code
        const values = expressions.map(({ start, end }) => `/${code.slice(start, end)}/`)

        try {
          const styles = config.parseTemplateString({
            strings,
            values,
            from: filename,
            processCSS: config.processCSS,
          })

          res = parseProps({ styles }).styles
        } catch (e) {
          if (config.throwError) {
            throw e
          } else {
            const sourceString = strings.join('')

            Logger.error(e.message, {
              filename,
              relative: {
                line: p.node.loc.start.line,
                column: getIndentNumber(sourceString),
              },
            })
          }
        }

        p.replaceWith(res)
      },
    },
  }
}
