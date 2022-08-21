import { Elm } from '../elm/Main'
import { Vanilla } from '../vanilla'

Vanilla(getContainerElement('vanilla'))
Elm.Main.init({ node: getContainerElement('elm') })

if (module.hot) {
  module.hot.accept()
}

function getContainerElement(elementId: string) {
  const el = document.getElementById(elementId)

  if (el) {
    return el
  }

  const nextEl = document.createElement('div')
  nextEl.setAttribute('id', elementId)
  document.body.appendChild(nextEl)

  return nextEl
}
