/**
 * Thanks to @sindresorhus with strip-indent
 * @see https://github.com/sindresorhus/strip-indent/blob/7c2f0e09ef4751c8bf2dc05d6ecb3c6df93689a3/index.js
 */
export default (str) => {
  const match = str.match(/^[ \t]*(?=\S)/gm)

  if (!match) return str

  return Math.min(...match.map(x => x.length))
}
