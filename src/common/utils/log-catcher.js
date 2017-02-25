export default class LogCatcher {
  constructor(out = console, type = 'log') {
    this.out = out
    this.type = type

    this.messages = []
    this.log = out[type]
  }

  start() {
    this.messages = []

    this.out[this.type] = (...args) => this.messages.push(args.join(' '))
  }

  done() {
    this.out[this.type] = this.log

    return this.messages
  }
}
