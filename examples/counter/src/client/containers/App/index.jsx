import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import injectSheet from 'react-jss'

import { counterIncrement, counterDecrement } from '~/actions'

import Counter from '~/components/Counter'

import style from './style.sss'


const App = ({ counter, classes, ...actions }) => (
  <div className={classes.app}>
    <section className={classes.content}>
      <header className={classes.header}>
        <h1>Babel Plugin PostJSS Example</h1>
      </header>

      <main>
        <Counter {...{ counter, actions }} />
      </main>
    </section>
  </div>
)

App.propTypes = {
  counter: PropTypes.number.isRequired,
  classes: PropTypes.shape({}),

  counterIncrement: PropTypes.func.isRequired,
  counterDecrement: PropTypes.func.isRequired,
}


export default connect(
  ({ counter }) => ({ counter }),
  { counterIncrement, counterDecrement },
)(injectSheet(style())(App))
