import React from "react"
import ReactDOM from "react-dom"
import './index.css';

import styled from "styled-components"
import { Provider } from "react-redux"
import { asReduxStore, connectReduxDevtools } from "mst-middlewares"
import { values } from "mobx"
import { types, onPatch, applyPatch } from "mobx-state-tree"
import { Observer, observer } from "mobx-react"

import DevTools from "mobx-react-devtools"

const Todo = types.model({
  name: "",
  done: false,
})
  .views(self => ({
    get render() {
      return (
        <Leaf leaf={self}>
          <input
            type="checkbox"
            checked={self.done}
            onChange={e => applyPatch(store, {
              op: "replace",
              path: self.$treenode.path + "/done",
              value: !self.done,
            })}
          />

          <Text item={self} leaf="name" value={self.name} />

          <Action.remove item={self}>X</Action.remove>
        </Leaf>
      )
    }
  }))

const Text = styled.input.attrs(({ item, leaf }) => ({
  type: "text",
  // value: item[leaf],
  onChange: ({ target }) => applyPatch(store, {
    op: "replace",
    path: `${item.$treenode.path}/${leaf}`,
    value: target.value,
  }),
}))`
`

const RootStore = types.model({
  todos: types.map(Todo)
})
  .views(self => ({
    get render() { return (
    <Leaf leaf={self}>
      <Action.add container={self.todos}>
        Add Task
      </Action.add>

      {values(store.todos).map(todo => ( todo.render))}
    </Leaf>
    ) }
  }))

const store = RootStore.create({
  todos: {
    "1": {
      name: "Eat something",
      done: true
    }
  }
})

const Leaf = styled.div.attrs({
  key: ({ leaf }) => leaf.$treenode.path,
})`
  border: 1px solid #ffffaa;
`

const Action = {
  add: styled.button.attrs(({ container }) => ({
    onClick: () => applyPatch(store, {
      op: "add",
      path: `${container.$treenode.path}/${Math.random()}`,
      value: {},
    })
  }))``,

  remove: styled.button.attrs(({ item }) => ({
    onClick: () => applyPatch(store, {
      op: "remove",
      path: item.$treenode.path,
    })
  }))``,
}

onPatch(store, (patch, previous) => console.log(patch))
connectReduxDevtools(require("remotedev"), store)
window.store = store

ReactDOM.render(
  <Provider store={asReduxStore(store)}>
    <Observer>
      {() => store.render}
    </Observer>
  </Provider>,
  document.getElementById('root'),
);
