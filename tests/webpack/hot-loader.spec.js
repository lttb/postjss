import path from 'path'
import Combinatorics from 'js-combinatorics'
import loader, { initPrepareFiles } from '~/webpack/hot-loader'


const getFileVariants = ({
  extensions = ['css', 'sss', 'scss', 'sass'],
  paths = ['', './', '../'],
  quotes = ['`', '"', '\''],
  filename = 'style',
} = {}) => Combinatorics
  .cartesianProduct(quotes, paths, extensions)
  .toArray()
  .map(([quote, route, extension]) =>
    `${quote + route + filename}.${extension + quote}`)

const getImportVariants = (files = getFileVariants()) => {
  const codes = ['import styles from $', 'const styles = require($)']

  return Combinatorics
    .cartesianProduct(codes, files)
    .toArray()
}

const getSourceMock = (variants = getImportVariants()) =>
  variants
    .map(([code, file]) => code.replace('$', file))
    .join('\n')


describe('PostJSS hot-loader', () => {
  it('should be a function', () => {
    expect(loader).toBeInstanceOf(Function)
  })

  it('should test RegExps', () => {
    const prepareFiles = initPrepareFiles()

    const variants = getImportVariants()

    const sourceMock = variants
      .map(([code, file]) => code.replace('$', file))
      .join('\n')

    const filesExpected = variants.map(([, file]) => file.slice(1, -1))

    expect(prepareFiles(sourceMock)).toEqual(filesExpected)
  })

  it('dummy test', () => {
    const ModuleMock = {
      cacheable: jest.fn(),
      dependency: jest.fn(),
      query: {},
      resource: '',
    }

    const sourceMock = 'test'

    const result = loader.call(ModuleMock, sourceMock)

    expect(result).toBe(sourceMock)
    expect(ModuleMock.cacheable).toBeCalled()
    expect(ModuleMock.dependency).not.toHaveBeenCalled()
  })

  it('should not add not existing dependencies', () => {
    const ModuleMock = {
      cacheable: jest.fn(),
      dependency: jest.fn(),
      query: {},
      resource: '',
    }

    const sourceMock = getSourceMock()

    const result = loader.call(ModuleMock, sourceMock)

    expect(result).toBe(sourceMock)
    expect(ModuleMock.cacheable).toBeCalled()
    expect(ModuleMock.dependency).not.toHaveBeenCalled()
  })

  it('should add existing dependency', () => {
    const deps = []

    const ModuleMock = {
      cacheable: jest.fn(),
      dependency: dep => deps.push(dep),
      query: {},
      resource: __filename,
    }

    const sourceMock = `
      import styles from './styles-mock.css'
    `

    const result = loader.call(ModuleMock, sourceMock)

    const depsExpected = [
      path.join(__dirname, 'styles-mock.css'),
    ]

    expect(result).toBe(sourceMock)
    expect(ModuleMock.cacheable).toBeCalled()
    expect(deps).toEqual(depsExpected)
  })
})
