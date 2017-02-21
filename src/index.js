import prepareConfig from './prepare-config'


export default ({ types: t }) => {
  let config

  return {
    pre() {
      if (config) {
        return
      }

      config = prepareConfig(this.opts)
    },

    visitor: {
      ImportDefaultSpecifier(p, { file }) {
        const { value } = p.parentPath.node.source

        if (!config.extensionsRe.test(value)) {
          return
        }

        p.parentPath.replaceWithSourceString(config.processCSS(file.opts.filename, value))

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

        p.replaceWithSourceString(config.processCSS(file.opts.filename, value))
      },
    },
  }
}
