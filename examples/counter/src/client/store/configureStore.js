import { createStore } from 'redux'

import rootReducer from '~/reducers'


const preloadedState = window.PRELOADED_STATE

export default () =>
  createStore(rootReducer, preloadedState)
