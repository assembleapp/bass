import styled from "styled-components"
import { applyPatch } from "mobx-state-tree"

export const Add = styled.button.attrs(({ to }) => ({
  onClick: () => applyPatch(window.store, {
    op: "add",
    path: `${to.$treenode.path}/${Math.random()}`,
    value: {},
  })
}))``

export const Remove = styled.button.attrs(({ item }) => ({
  onClick: () => applyPatch(window.store, {
    op: "remove",
    path: item.$treenode.path,
  })
}))``
