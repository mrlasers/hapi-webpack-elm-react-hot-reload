console.log("It's working, ain't it!?!")

const app = getAppContainer()

app.innerHTML =
  '<p>He was a <strong>dark</strong> and <em>stormy</em> knight...</p>'

if (module.hot) {
  module.hot.accept()
}

function getAppContainer() {
  const app = document.getElementById('app')

  if (app) {
    return app
  }

  const newApp = document.createElement('div')
  newApp.setAttribute('id', 'app')
  document.body.appendChild(newApp)

  return newApp
}
