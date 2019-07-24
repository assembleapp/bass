import styled from "styled-components"
import { applyPatch } from "mobx-state-tree"

export const Checkbox = styled.input.attrs(({ item, leaf }) => ({
  type: "checkbox",
  onChange: () => applyPatch(window.store, {
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
  onChange: ({ target }) => applyPatch(window.store, {
    op: "replace",
    path: `${item.$treenode.path}/${leaf}`,
    value: target.value,
  }),
}))`
  width: 6rem;
`
