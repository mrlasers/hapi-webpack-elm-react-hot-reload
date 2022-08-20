import Path from 'path'
import { promisify } from 'util'
import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

import Hapi from '@hapi/hapi'

import WebpackConfig, { mode } from '../webpack.config'

async function init(
  port: number = 8000,
  host: string = 'localhost'
): Promise<Hapi.ServerInfo> {
  const server = Hapi.server({
    port: port,
    host: host,
  })

  await server.register([
    { plugin: require('blipp'), options: { showAuth: true } },
  ])

  if (mode !== 'development') {
    server.route({
      method: '*',
      path: '/{any*}',
      handler: (request, h) => {
        return `Hapi server has not yet been implemented.`
      },
    })
  }

  if (mode === 'development') {
    const compiler = Webpack(WebpackConfig)
    const devMiddleware = require('webpack-dev-middleware')(compiler, {
      publicPath: WebpackConfig.output.publicPath,
    })
    const hotMiddleware = WebpackHotMiddleware(compiler, {
      log: console.log,
      path: '/__webpack_hmr',
    })

    server.ext([
      {
        type: 'onRequest',
        method: (request, h) => {
          return new Promise((resolve, reject) => {
            devMiddleware(request.raw.req, request.raw.res, (err: any) =>
              err ? reject(err) : resolve(h.continue)
            )
          })
        },
      },
      {
        type: 'onRequest',
        method: (request, h) => {
          return new Promise((resolve, reject) => {
            hotMiddleware(request.raw.req, request.raw.res, (err: any) =>
              err ? reject(err) : resolve(h.continue)
            )
          })
        },
      },
    ])

    server.route({
      method: '*',
      path: '/{any*}',
      handler: (request, h) => {
        return new Promise((resolve, reject) => {
          const filename = Path.join(compiler.outputPath, 'index.html')
          compiler.outputFileSystem.readFile(filename, (err, result) =>
            err ? reject(err) : resolve(h.response(result).type('text/html'))
          )
        })
      },
    })
  }

  await server.start().catch(console.error)

  return server.info
}

init().then((info) => console.log(`Server running on ${info.uri}...`))
