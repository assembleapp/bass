// https://www.npmjs.com/package/react-qr-reader
// https://www.npmjs.com/package/qrcode.react

import React                                  from "react";

import styled                                 from "styled-components"
import ReactDOM                               from "react-dom"

import { values }                             from "mobx"
import { Observer }                           from "mobx-react"
import { applyPatch, types }                  from "mobx-state-tree";

export const list = (items) => (
  values(items).map((item, index) => (
    React.createElement(
      Layout,
      { leaf: item, key: `${item}-${index}` },
      item.show,
    )
  ))
)

export const activate = (memory, render) => {

  // move: observable library
  memory.go = memory.create

  render.memory = memory.go()
  render.pane   = document.getElementById("pane")

  ReactDOM.render(

    <Observer>
      {() => render.memory.show}
    </Observer>,

    render.pane,

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


export const Label = types
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
          checked: self.done,
          key: "check",
        }),

        React.createElement(Text, {
          item: self,
          leaf: "name",
          value: self.name,
          key: "name",
        }),

        React.createElement(
          Remove,
          { item: self, key: "remove" },
          "X",
        )

      ];
    }
  }))

export const Gaze = types
  .model({ labels: types.map(Label) })

  .views(self => ({
    get show() {
      return [
        React.createElement(Add, { to: self.labels }, "Add Label"),
        list(self.labels)
      ];
    }
  }));

activate(Gaze, window);
