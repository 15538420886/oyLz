import 'bootstrap-css';
import 'antd-css';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { Router, Route, IndexRoute, IndexRedirect, RouterContext, match, browserHistory, createMemoryHistory } from 'react-router';
import routes from './routes-app';
import Helmet from 'react-helmet';

// Client render (optional):
if (typeof document !== 'undefined') {
  const outlet = document.getElementById('app');

  let Holder;
  window.addEventListener('DOMContentLoaded', () => {
    Holder = require('holderjs');
  });

  ReactDOM.render(
    <Router
      onUpdate={() => {
        window.scrollTo(0, 0);

        if (Holder) {
          Holder.run();
        }
      }}
      history={browserHistory}
      routes={routes}
    />,
    outlet
  );
}

// Exported static site renderer:
export default (locals, callback) => {
  const history = createMemoryHistory();
  const location = history.createLocation(locals.path);

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    const body = ReactDOMServer.renderToString(<RouterContext {...renderProps} />);
    const head = Helmet.rewind();
    let markup = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          ${head.title.toString()}
          ${head.meta.toString()}
          <link rel=icon href=/assets/favicon.ico>
          <link rel="stylesheet" href="/react_lz.css"/>
          <link rel="stylesheet" href="/assets/docs.css"/>
        </head>
        <body style="width:100%; margin:0;padding:0; background-color:#fefefe">
          <div id="app" style="width:100%; height:100%">${body}</div>
          <script src="/react_lz.js"></script>
          <script src="/assets/prism.js" data-manual></script>
          <script src="/common.js"></script>
          <script src="/uman.js"></script>
        </body>
      </html>`;
    callback(null, markup);
  });
};
