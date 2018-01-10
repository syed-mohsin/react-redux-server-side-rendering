import path from 'path'
import Express from 'express'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import counterApp from './reducers'
import App from './containers/App'

const app = Express();
const port = 3000;

//Serve static files
app.use('/static', Express.static('build/static'));

app.use(handleRender);

import { renderToString } from 'react-dom/server'

function handleRender(req, res) {
  setTimeout(() => {
    // set initial state
    const state = parseInt(req.query.counter) || Math.floor(Math.random() * 100);

    // Create a new Redux store instance
    const store = createStore(counterApp, state);

    // Render the component to a string
    const html = renderToString(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Grab the initial state from our Redux store
    const preloadedState = store.getState();

    // Send the rendered page back to the client
    res.send(renderFullPage(html, preloadedState))
  }, 500)
}

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="/static/js/main.5a764b6c.js"></script>
      </body>
    </html>
    `
}

app.listen(port, () => console.log('server listening on port', port));
