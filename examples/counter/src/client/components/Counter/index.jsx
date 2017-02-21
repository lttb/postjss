import React, { PropTypes } from 'react'


const Counter = ({ counter, actions: { counterIncrement, counterDecrement } }) => (
  <div>
    <p>
      {`Counter clicked ${counter} times`}
    </p>

    <button onClick={counterIncrement}>Increment</button>
    <button onClick={counterDecrement}>Decrement</button>
  </div>
)

Counter.propTypes = {
  counter: PropTypes.number.isRequired,

  actions: PropTypes.shape({
    counterIncrement: PropTypes.func.isRequired,
    counterDecrement: PropTypes.func.isRequired,
  }),
}


export default Counter
