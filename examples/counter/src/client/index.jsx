import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './containers/App'
import configureStore from './store/configureStore'


const store = configureStore()

const renderApp = () => render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
)

renderApp()

if (module.hot) {
  module.hot.accept('./containers/App', renderApp)
}
