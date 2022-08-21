import './main.scss'

import { Elm } from '../elm/Main'
import { react } from '../react'
import { vanilla } from '../vanilla'

const app = getContainerElement('app')
// app.innerHTML = ''

vanilla(getContainerElement('vanilla', app))
Elm.Main.init({ node: getInnerContainer(getContainerElement('elm', app)) })
react(getContainerElement('react', app))

if (module.hot) {
  module.hot.accept()
  // module.hot.accept('../elm/Main', function () {})
}

// gotta do this for Elm, because it doesn't replace what's inside the element, it replaces the entire element
function getInnerContainer(element: HTMLElement) {
  const innerEl = document.createElement('div')
  element.innerHTML = ''
  element.appendChild(innerEl)

  return innerEl
}

function getContainerElement(
  elementId: string,
  parent?: HTMLElement,
  doubleStuff?: boolean
): HTMLElement {
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
