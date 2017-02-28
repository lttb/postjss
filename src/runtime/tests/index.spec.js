import { postjssAsync } from '~/runtime'


describe('PostJSS runtime', () => {
  it('simple test', async () => {
    const postjss = await postjssAsync

    const test = 5

    const left = () => test + 10

    const styles = await postjss`
      .app
        position: absolute
        left: ${left}
    `

    const expected = {
      app: {
        left,
        position: 'absolute',
      },
    }

    expect(styles).toEqual(expected)
  })
})
