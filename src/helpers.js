import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { asReduxStore, connectReduxDevtools } from "mst-middlewares"
import { Observer } from "mobx-react"

import { values } from "mobx"
import {
  Layout,
} from "./elements"

export const list = (items) => (
  values(items).map(item => (
    React.createElement(Layout, { leaf: item }, [item.render])
  ))
)

// Use as:
// activate(MobxStateTreeStore, window, "root")
export const activate = (store, context, elementID) => {
  context.store = store.create()
  connectReduxDevtools(require("remotedev"), context.store)

  ReactDOM.render(
    <Provider store={asReduxStore(context.store)}>
      <Observer>
        {() => context.store.render}
      </Observer>
    </Provider>,
    document.getElementById(elementID),
  );
}
