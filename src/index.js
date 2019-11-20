// https://www.npmjs.com/package/react-qr-reader
// https://www.npmjs.com/package/qrcode.react

import React                                  from "react";

import styled                                 from "styled-components"
import ReactDOM                               from "react-dom"

import { values }                             from "mobx"
import { Observer }                           from "mobx-react"
import { applyPatch, types }                  from "mobx-state-tree";

export const run = (memory, render) => {

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

export const list = (items) => (
  <div>
    {values(items).map((item, index) => (
      <Lay leaf={item} key={`${item}-${index}`}>
        {item.show}
      </Lay>
    ))}
    <Add to={items}>Add</Add>
  </div>
)

export const Checkbox = styled.input.attrs(({ item, leaf }) => ({
  type: "checkbox",
  onChange: () => applyPatch(window.memory, {
    op: "replace",
    path: `${item.$treenode.path}/${leaf}`,
    value: !item[leaf],
  })
}))``

export const Lay = styled.div.attrs(({ leaf }) => ({
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
  })

  .views(self => ({
    get show() {
      return [

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

  .model({
    labels: types.map(Label),
  })

  .views(self => ({
    get show() {
      return [
        <svg viewbox="0 0 100 100">
          <path d="M0 0 h 100 v 100 h -100 V 70" stroke="#dd0dd0" fill="none" />
          <path d="M10 10 l 40 40" stroke="#550055" fill="none" />

          <text x="60" y="50">{(values(self.labels)[0] || {}).name}</text>
        </svg>,

        list(self.labels),

        <pre>
          {JSON.stringify(self.toJSON(), null, 2)}
        </pre>,

        <Frame src="/index.js" />
      ];
    }
  }));

export const Frame = styled.iframe`
display: block;
position: absolute;
height: 100vh;
top: 0;
bottom: 0;
right: 0;
width: 50vw;
`

run(Gaze, window);
