# babel-plugin-prejss

This plugin allows to use PostCss features (plugins, parsers etc.) for compiling to JSS object, so you can take benefits from both.

## Installation

```sh
npm i babel-plugin-prejss -D
```

## Options

This plugin uses [postcss-load-config](https://github.com/michael-ciniawsky/postcss-load-config), so you need to set **PostCSS options** in `package.json/.postcssrc/postcss.config.js/.postcssrc.js`

- `extensionsRe` - RegExp for extensions. By default `(c|(s[ac]?))ss` - for css, sass, scss, sss
- `namespace` - Set your custom namespace for tagged literals. By default its `prejss`

*.babelrc* example:

```js
plugins: [
  [
    'prejss', {
      extensionsRe: 's[ac]?ss',
      namespace: 'customPreJssNamespace'
    }
  ]
]
```

## How it works?

Please check a [counter example](https://github.com/lttb/babel-plugin-prejss/tree/master/examples/counter)

### As tagged template literal

This plugin transforms tagged literal into the JSS-object by PostCSS, like:

```jsx
const styles = prejss`
  .${selector}
    left: ${() => 0}

    margin-${marginType}: 10px

    transition: ${'opacity'} 1s

    color: ${color}
`
```

After transpile it would look like:
```jsx
const styles = {
  [selector]: {
    left: () => 0,
    [`margin-${marginType}`]: '10px',
    transition: 'opacity 1s',
    color: color
  }
}
```

You are free to use all PostCSS feature and custom `prejss syntax` (see bellow)

> Notice that if you are using `stylelint` and `property-no-unknown` rule, you need to set an option like this (it's required for current prejss parser implementation):
> `property-no-unknown: [true, { ignoreProperties: ['/\$\^var__/'] }]`

### As a separate styles file

After transpiling imported styles inlined into variable (import name) as a function expression, that accepts an object with arguments and returns a JSS object with styles with arguments usage. Notice that arguments name has uniq scope, so you need not worry about names conflict.

Say you have this *styles.sss* (with SugarSS i.e.):

```stylus
.langList
  display: flex

  margin: 0
  padding: 0

  list-style: none

.lang
  margin-right: 10px
  padding: 5px

  &.current
    border-bottom: 1px solid red
```

And a component using it:
```jsx
import style from './style.sss'
```

After babel transpiling your component become as:
```jsx
const styles = function (izexozk) {
  izexozk = Object.assign({}, izexozk);
  return {
    ".langList": {
      "display": "flex",
      "margin": "0",
      "padding": "0",
      "listStyle": "none"
    },
    ".lang": {
      "marginRight": "10px",
      "padding": "5px",
      "&.current": {
        "borderBottom": "1px solid red"
      }
    }
  };
}
```

And you can use this with JSS like:
```jsx
injectSheet(style())
```

### Syntax

You can use specific syntax for some JSS-features in your CSS:
- `/JS Code/` - you can place JS-block wrapped by `/` in every property value
```stylus
.app
  display: /({ visible }) => visible ? 'block' : 'none'/
```
- `^variableName` - allows you to use variables passed as arguments to the style function
```stylus
.app
  background-color: /^color || $color/
```
- `defaults` block for default values - it would be default for accepting args
```stylus
defaults:
  prop: /^prop || 'test'/
  selector: ''
```
- `--^propertyName` - for custom property/selector names
```stylus
.app
  --^prop: 100vw

--^selector:
  display: none
```

### Full Example

*style.sss*
```stylus
@import 'vars.sss'
@import 'mixins.sss'

$color: 'green'

:root
  --color: $color

defaults:
  prop: /^prop || 'test'/
  selector: ''

.app
  position: absolute
  top: 0
  left: 0

  display: /({ name }) => name + 1 + $color-from-import/
  overflow-y: auto
  flex-direction: column

  width: 100vw
  height: 100vh

  color: var(--color)
  background-color: /^value || $color/

  --^prop: 100vw

--^selector:
  display: none

.content
  @mixin container

  padding: 20px

.header
  border-bottom: 1px solid #eee
```

*component.jsx*
```jsx
const style = function (izezix) {
  izezix = Object.assign({
    "prop": izezix.prop || 'test',
    "selector": "''"
  }, izezix);
  return {
    ".app": {
      "position": "absolute",
      "top": "0",
      "left": "0",
      "display": function ({
        name
      }) {
        return name + 1 + 'black';
      },
      "overflowY": "auto",
      "flexDirection": "column",
      "width": "100vw",
      "height": "100vh",
      "color": "green",
      "backgroundColor": izezix.value || 'green',
      [izezix.prop]: "100vw"
    },
    [izezix.selector]: {
      "display": "none"
    },
    ".content": {
      "position": "absolute",
      "margin": "0 auto",
      "&::before": {
        "content": "''"
      },
      "padding": "20px"
    },
    ".header": {
      "borderBottom": "1px solid #eee"
    }
  };
}
```

## Links

* [JSS](https://github.com/cssinjs/jss) - Great lib for CSS in JS
* [PostCSS](https://github.com/postcss/postcss) - Awesome tool for customizable style transform

## License
MIT
