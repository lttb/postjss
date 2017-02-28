import postjss from '~/runtime'


describe('PostJSS runtime', () => {
  it('simple test', () => {
    const test = 5

    const left = () => test + 10

    const styles = postjss`
      .app
        position: absolute
        left: ${left}
    `

    expect(styles).toEqual({
      app: {
        left,
        position: 'absolute',
      },
    })
  })
})
