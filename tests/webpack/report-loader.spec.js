import { LOGGER } from '~/common/const'
import LogCatcher from '~/common/utils/log-catcher'

const logger = new LogCatcher()
logger.start()

describe('PostJSS report-loader', () => {
  const loader = require('~/webpack/report-loader').default

  it('should be a function', () => {
    expect(loader).toBeInstanceOf(Function)
  })

  it('should be a function', () => {
    const errors = []

    const ModuleMock = {
      cacheable: jest.fn(),
      dependency: jest.fn(),
      emitError: error => errors.push(error),
      query: {},
      resource: __filename,
    }

    const sourceMock = 'test'

    const messagesExpected = ['test1', 'test2', 'test3 test4']
    const errorsExpected = ['error1', 'error2', 'error3 error4']

    messagesExpected.forEach(message =>
      console.log(...message.split(' ')))

    errorsExpected.forEach(error =>
      console.log(`${LOGGER.ERROR_ID}:${__filename}`, ...error.split(' ')))

    const result = loader.call(ModuleMock, sourceMock)

    expect(result).toBe(sourceMock)
    expect(ModuleMock.cacheable).toBeCalled()
    expect(logger.messages).toEqual(messagesExpected)
    expect(errors).toEqual(errorsExpected)
  })
})
