import React, { PropTypes } from 'react'
import injectSheet from 'react-jss'


const getButtonStyles = ({ color, marginType, selector }) => postjss`
  .${selector}
    left: ${() => 0}

    margin-${marginType}: 10px

    transition: ${'opacity'} 1s

    color: ${color}
`

const Button = (({ classes, onClick, children }) => (
  <button className={classes.button} onClick={onClick}>
    {children}
  </button>
))

const StyledButton = injectSheet(getButtonStyles({
  color: 'red',
  marginType: 'right',
  selector: 'button',
}))(Button)


const counterStyles = postjss`
  .counter
    padding: 0
`

const Counter = ({ classes, counter, actions: { counterIncrement, counterDecrement } }) => (
  <div className={classes.counter}>
    <p>
      {`Counter clicked ${counter} times`}
    </p>

    <StyledButton onClick={counterIncrement}>Increment</StyledButton>
    <StyledButton onClick={counterDecrement}>Decrement</StyledButton>
  </div>
)

const StyledCounter = injectSheet(counterStyles)(Counter)

Counter.propTypes = {
  counter: PropTypes.number.isRequired,

  actions: PropTypes.shape({
    counterIncrement: PropTypes.func.isRequired,
    counterDecrement: PropTypes.func.isRequired,
  }),
}


export default StyledCounter
