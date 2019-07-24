// https://www.npmjs.com/package/react-qr-reader
// https://www.npmjs.com/package/qrcode.react

import React from "react"
import './index.css';
import { types } from "mobx-state-tree"
import { activate, list, } from "./helpers"
import { Checkbox, Text, } from "./elements"
import { Add, Remove, } from "./actions"

const Software = types.model({
  tasks: types.map(types.model({
    name: "",
    done: false,
  }).views(self => ({ get render() { return [
    React.createElement(Checkbox, { item: self, leaf: "done", checked: self.done }  ),
    React.createElement(Text, { item: self, leaf: "name", value: self.name } ),
    React.createElement(Remove, { item: self }, "X"),
  ] } })))
}).views(self => ({ get render() { return [
  React.createElement(Add, { to: self.tasks }, "Add Task"),
  list(self.tasks),
] } }))

activate(Software, window, "root")
