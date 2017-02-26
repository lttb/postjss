# PostJSS

This project allows to use PostCSS features (plugins, syntaxes etc.) for compiling to JSS object via babel, so you can take benefits from both.

+ [Advantages](#advantages)
+ [Installation](#installation)
+ [Babel Plugin Options](#babel-plugin-options)
+ [How it works?](#how-it-works)
  - [As tagged template literal](#as-tagged-template-literal)
  - [As separate styles file](#as-a-separate-styles-file)
+ [Custom PostJSS Syntax](#custom-postjss-syntax)
+ [Hot Module Replacement](#hot-module-replacement)
+ [Linting](#linting)
+ [Rebuild optimization](#rebuild-optimization)

You may also be interested in this project for runtime usage: [jss-from-postcss](https://github.com/axept/jss-from-postcss)

## Advantages

- With PostJSS very easy to start using JSS from SASS/SCSS/PostCSS etc. All you need - update your components and use PostJSS Babel Plugin
- You can continue use your favorite syntax and the power of PostCSS plugins (stylelint, sort-order etc.), but take advantages of CSS in JS - awesome!
- You can write styles in styled-components way, css-modules way or in both - the choice is yours
- You can build your project just with babel
- Static compilation, no runtime overhead!
- You can use any library that is compatible with the JSS-object, not only JSS

## Installation

```sh
npm i postjss -S
```

## Babel Plugin Options

This plugin uses [postcss-load-config](https://github.com/michael-ciniawsky/postcss-load-config), so you **need** to set **PostCSS options** in *package.json/.postcssrc/postcss.config.js/.postcssrc.js*

Plugin Options:

- `extensionsRe`: `String` - RegExp for extensions. By default `(c|(s[ac]?))ss` - for css, sass, scss, sss
- `namespace`: `String` - Set your custom namespace for tagged literals. By default its `postjss`
- `throwError`: `Boolean` - Plugin will throw an error and stop transpiling, if error caused by PostCSS (eg `styleling` errors). By default `false`

*.babelrc* example:

```js
plugins: [
  [
    'postjss/babel', {
      extensionsRe: 's[ac]?ss',
      namespace: 'customPostJSSNamespace',
      throwError: false
    }
  ]
]
```

## How it works?

Please check the [counter example](https://github.com/lttb/postjss/tree/master/examples/counter)

### As tagged template literal

Babel PostJSS plugin transforms tagged literal into the JSS-object by PostCSS, like:

```jsx
const styles = postjss`
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

You are free to use all PostCSS feature and custom `postjss syntax` (see bellow)

> Notice that if you are using `stylelint` and `property-no-unknown` rule, you need to set an option like this (it's required for current postjss parser implementation):
> `property-no-unknown: [true, { ignoreProperties: ['/\$\^var__/'] }]`

### As a separate styles file

After transpiling imported styles inlined into variable (import name) as a function expression, that accepts an object with arguments and returns a JSS object with styles with arguments usage. Notice that arguments name has uniq scope, so you need not worry about names conflict.

Say you have this *styles.sss* (with SugarSS i.e.):

```stylus
.lang-list
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
    "langList": {
      "display": "flex",
      "margin": "0",
      "padding": "0",
      "listStyle": "none"
    },
    "lang": {
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

## Custom PostJSS Syntax

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

## Hot Module Replacement

For tagged literals HMR supported out of the box. But for separate styles you need to use `postjss hot-loader` with webpack:
Notice, that you need to set this loader **after** `babel-loader`.

```js
use: [
  'babel-loader',
  'postjss/webpack/hot-loader',
]
```

## Linting

You can use [stylelint](https://github.com/stylelint/stylelint) for linting and [postcss-reporter](https://github.com/postcss/postcss-reporter) for warnings and errors.
So with PostJSS it works like a charm:

### For CSS files:

![sss](https://cloud.githubusercontent.com/assets/11135392/23332790/9ee8325e-fb90-11e6-848d-ce4734814b39.gif)

### For tagged literals:

![postjss](https://cloud.githubusercontent.com/assets/11135392/23332827/1d705f20-fb91-11e6-8b13-146a65cf3ed5.gif)


## Rebuild optimization

Let's say you use some tool for linting. But if you set `throwError: true` for `postjss`, it will cause a babel transpilling error, so babel will have to build other files next time, not only fixed.

You can set `throwError: false` for dev building to avoid this, and use `postjss report-loader` for webpack (set this loader **before** `babel-loader`:

```js
use: [
  'postjss/webpack/report-loader',
  'babel-loader',
]
```

This will break webpack compiling if there are some errors in PostJSS, but not babel transpiling. And then babel needs to rebuild only fixed file.

## Full Example

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
    "app": {
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
    "content": {
      "position": "absolute",
      "margin": "0 auto",
      "&::before": {
        "content": "''"
      },
      "padding": "20px"
    },
    "header": {
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
