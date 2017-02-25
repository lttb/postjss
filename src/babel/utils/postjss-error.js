export default class PostJSSError extends Error {
  constructor(message, data = []) {
    super(`${message}\n${data.join('')}`)

    this.name = this.constructor.name

    this.stack = ''
  }
}
