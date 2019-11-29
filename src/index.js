// https://www.npmjs.com/package/react-qr-reader
// https://www.npmjs.com/package/qrcode.react
// import Parser from "web-tree-sitter"
// import page from "volume-page.images/001-0001"

import React                 from "react";

import styled                from "styled-components"
import ReactDOM              from "react-dom"

import { values }            from "mobx"
import { Observer }          from "mobx-react"
import { applyPatch, types } from "mobx-state-tree";

export const run = (memory, render) => {
  render.memory = memory.create()
  render.pane   = document.getElementById("pane")

  ReactDOM.render(

    <Observer>
      {() => render.memory.show}
    </Observer>,

    render.pane,

  );
}

export const blob = (pups, space=4) => (
  <div>
    {values(pups).map((item, index) => (
      <Lay leaf={item} key={`${item}-${index}`}>
        {item.show}
      </Lay>
    ))}

    { values(pups).length < space
      ?  <New blob={pups}>New</New>
      : "no space"
    }
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

export const New = styled.button.attrs(({ blob }) => ({

  onClick: () => applyPatch(window.memory, {
    op: "add",
    path: `${blob.$treenode.path}/${Math.random()}`,
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
        <Bay>
          <Draw>
            <Line d={`M 0 0 h 100 v 100 h -100 V 70`} stroke="#dd0dd0" />

            {values(self.labels).map((label, index) => (
              <>
                <Line d={`M 10 20 l 40 ${5 + 20 * index}`} stroke="#550055" />
                <text x={`60`} y={30 + 20 * index}>{label.name}</text>
              </>
            ))}
          </Draw>

          {blob(self.labels)}

          <Frame src="/index.js" />
        </Bay>,

        <Bay>
          <Frame src="http://localhost:4567/focus" />
          <Frame src="http://localhost:4567/analysis" />
        </Bay>,

        <Bay>
          <Frame src="http://localhost:4567/corpus" />
          <Frame src="http://localhost:4567/grammar" />
        </Bay>,
      ];
    }
  }))

export const Frame = styled.iframe`
display: block;
top: 0;
bottom: 0;
right: 0;
width: 50vw;
`

export const Bay = styled.div`
padding: 2rem;
display: flex;
flex-direction: row;
flex: 0 1 100%;
height: 50%;
justify-content: space-between;
`

const Draw = styled.svg.attrs({ viewBox: "0 0 100 100" })`
height: 20rem;
width: 20rem;
`

const Line = styled.path`
fill: none;
`

let go = async () => {
  // console.log("fetching")
  // fetch("http://localhost:4567/focus").then(() =>
  // console.log("fetched")
  // )
  // let { value, done } = await response.body.text()

  run(Gaze, window);
}
go()
