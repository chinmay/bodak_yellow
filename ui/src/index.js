import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { compose, applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/lib/integration/react";
import { composeWithDevTools } from "redux-devtools-extension";
import localForage from "localforage";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import rootReducer from "./rootReducer";
import registerServiceWorker from "./registerServiceWorker";
import "./shared/css/global.css";

import App from "./containers/App";

require("typeface-roboto");
require("typeface-roboto-mono");

window.scrollTo(0, 1);

const isDevelopment = process.env.NODE_ENV === "development";
const persistConfig = {
  key: "xvia_demo",
  storage: localForage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewarePackeges = [thunk];
if (isDevelopment) {
  const { logger } = require("redux-logger"); // eslint-disable-line global-require
  middlewarePackeges.push(logger);
}
const middleware = applyMiddleware(...middlewarePackeges);

let enhancers;
if (isDevelopment) {
  enhancers = composeWithDevTools(middleware);
} else {
  enhancers = compose(middleware);
}

export const store = createStore(persistedReducer, enhancers);
export const persistor = persistStore(store);
persistor.purge();
const renderApp = () => {
  ReactDOM.render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </I18nextProvider>,
    document.getElementById("demo")
  );
};

// Check if polyfill required
// < IE11
if (!Intl || !Map || !Set) {
  if (!Promise) {
    require("es6-promise/auto"); // eslint-disable-line global-require
  }
  // Webpack parses the inside of require.ensure at build time to know that intl
  // should be bundled separately. You could get the same effect by passing
  // ['intl'] as the first argument.
  require.ensure([], () => {
    // Ensure only makes sure the module has been downloaded and parsed.
    // Now we actually need to run it to install the polyfill.
    require("intl"); // eslint-disable-line global-require
    require("raf"); // eslint-disable-line global-require
    require("core-js"); // eslint-disable-line global-require

    // Carry on
    renderApp();
  });
} else {
  // Polyfill wasn't needed, carry on
  renderApp();
}

registerServiceWorker();
