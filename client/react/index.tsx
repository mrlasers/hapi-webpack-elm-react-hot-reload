import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import { App } from './app'

export const react = (el: HTMLElement) => {
  const root = ReactDOM.createRoot(el)

  root.render(<App />)
}
