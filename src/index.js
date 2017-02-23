import R from 'ramda'

import prepareConfig from './prepare-config'
import requireModule from './utils/require-module'
import parseTemplateString from './parse-template-string'


export default ({ types: t }) => {
  let config
  let processCSSModule

  return {
    pre() {
      if (config) {
        return
      }

      config = prepareConfig(this.opts)
      processCSSModule = R.compose(config.processCSS, requireModule)
    },

    visitor: {
      ImportDefaultSpecifier(p, { file }) {
        const { value } = p.parentPath.node.source

        if (!config.extensionsRe.test(value)) {
          return
        }

        p.parentPath.replaceWithSourceString(
          processCSSModule(file.opts.filename, value),
        )

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

        p.replaceWithSourceString(
          processCSSModule(file.opts.filename, value),
        )
      },

      TaggedTemplateExpression(p, { file }) {
        const { tag } = p.node

        if (tag.name !== config.namespace) {
          return
        }

        const { quasis, expressions } = p.node.quasi
        const { code } = p.hub.file

        p.replaceWithSourceString(parseTemplateString({
          quasis,
          expressions,
          code,
          from: file.opts.filename,
          processCSS: config.processCSS,
        }))
      },
    },
  }
}
