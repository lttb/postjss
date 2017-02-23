/* eslint-disable react/jsx-filename-extension */


import pug from 'pug'
import express from 'express'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { renderToString } from 'react-dom/server'

import { SheetsRegistryProvider, SheetsRegistry } from 'react-jss'

import rootReducer from '../client/reducers'
import App from '../client/containers/App'


const renderFullPage = pug.compileFile('src/client/templates/server.pug')

const handleRender = ({ query, params }, res) => {
  const { counter } = query

  const store = createStore(rootReducer, { counter: Number(counter) || 0 })
  const sheets = new SheetsRegistry()

  const html = renderToString(
    <Provider store={store}>
      <SheetsRegistryProvider registry={sheets}>
        <App />
      </SheetsRegistryProvider>
    </Provider>,
  )

  res.send(renderFullPage({
    html,
    state: store.getState(),
    sheets: sheets.toString(),
  }))
}

;(async () => {
  const app = express()
  const port = 3000

  app.use('/static', express.static('dist'))
  app.use('/', handleRender)

  app.listen(port, () => console.log(`listening on port ${port}`))
})()

