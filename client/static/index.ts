import './main.scss'

import { Elm } from '../elm/Main'
import { Vanilla } from '../vanilla'

const app = getContainerElement('app')

Vanilla(getContainerElement('vanilla', app))
Elm.Main.init({ node: getContainerElement('elm', app) })

if (module.hot) {
  module.hot.accept()
}

function getContainerElement(elementId: string, parent?: HTMLElement) {
  const el = document.getElementById(elementId)

  if (el) {
    return el
  }

  const nextEl = document.createElement('div')
  nextEl.setAttribute('id', elementId)

  const container = parent ?? document.body

  container.appendChild(nextEl)

  return nextEl
}
