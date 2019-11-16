// https://www.npmjs.com/package/react-qr-reader
// https://www.npmjs.com/package/qrcode.react

import React                                  from "react";

import styled                                 from "styled-components"
import ReactDOM                               from "react-dom"

import { values }                             from "mobx"
import { Observer }                           from "mobx-react"
import { applyPatch, types }                  from "mobx-state-tree";

export const list = (items) => (
  values(items).map(item => (
    React.createElement(Layout, { leaf: item }, [item.show])
  ))
)

// Use as:
// activate(MobxStateTreeStore, window, "pane")
export const activate = (memory, render, pane) => {
  render.memory = memory.create()

  ReactDOM.render(
    <Observer>
      {() => render.memory.show}
    </Observer>,
    document.getElementById("pane"),
  );
}

export const Checkbox = styled.input.attrs(({ item, leaf }) => ({
  type: "checkbox",
  onChange: () => applyPatch(window.memory, {
    op: "replace",
    path: `${item.$treenode.path}/${leaf}`,
    value: !item[leaf],
  })
}))``

export const Layout = styled.div.attrs(({ leaf }) => ({
  key: leaf.$treenode.path,
}))`
  border: 1px solid #ffffaa;
`

export const Text = styled.input.attrs(({ item, leaf }) => ({
  type: "text",
  onChange: ({ target }) => applyPatch(window.memory, {
    op: "replace",
    path: `${item.$treenode.path}/${leaf}`,
    value: target.value,
  }),
}))`
  width: 6rem;
`

export const Add = styled.button.attrs(({ to }) => ({
  onClick: () => applyPatch(window.memory, {
    op: "add",
    path: `${to.$treenode.path}/${Math.random()}`,
    value: {},
  })
}))``

export const Remove = styled.button.attrs(({ item }) => ({
  onClick: () => applyPatch(window.memory, {
    op: "remove",
    path: item.$treenode.path,
  })
}))``

const Gaze = types
  .model({
    tasks: types.map(
      types
        .model({
          name: "",
          done: false
        })
        .views(self => ({
          get show() {
            return [
              React.createElement(Checkbox, {
                item: self,
                leaf: "done",
                checked: self.done
              }),
              React.createElement(Text, {
                item: self,
                leaf: "name",
                value: self.name
              }),
              React.createElement(Remove, { item: self }, "X")
            ];
          }
        }))
    )
  })
  .views(self => ({
    get show() {
      return [
        React.createElement(Add, { to: self.tasks }, "Add Task"),
        list(self.tasks)
      ];
    }
  }));

activate(Gaze, window);
