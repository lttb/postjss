import { handleActions } from 'redux-actions'
import { COUNTER_INCREMENT, COUNTER_DECREMENT } from '~/constants/ActionTypes'

export default handleActions({
  [COUNTER_INCREMENT]: state => state + 1,

  [COUNTER_DECREMENT]: state => state - 1,
}, 0)
