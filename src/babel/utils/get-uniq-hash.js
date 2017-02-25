const numberRe = /\d/g


export default () => Date.now().toString(36).replace(numberRe, '')
