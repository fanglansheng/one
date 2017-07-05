import { renderToString } from 'react-dom/server';
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux';

export const handleRender = (req, res, next) => {
  // Create a new Redux store instance
  // const store = createStore(counterApp);

  // Render the component to a string
  // const html = renderToString(
  //   <Provider store={store}>
  //     <App />
  //   </Provider>
  // );
  const html = 'Hello!!';

  // Grab the initial state from our Redux store
  // const preloadedState = store.getState();

  // Send the rendered page back to the client
  console.log('using middleware');

  res.send(renderFullPage(html, {}));//preloadedState));
  // next();
};

const renderFullPage = (html, preloadedState) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Trip Planner</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
};