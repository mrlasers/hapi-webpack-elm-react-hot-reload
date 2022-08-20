import { IncomingMessage, ServerResponse } from 'http'
import Path from 'path'
import Webpack, { Configuration } from 'webpack'

import Hapi from '@hapi/hapi'

const WebpackDevMiddlewarePlugin: Hapi.Plugin<{
  production: boolean
  webpackConfig: Configuration
}> = {
  name: 'whatever',
  version: '1.0.0',
  dependencies: {
    '@hapi/inert': '7.x.x',
  },
  register: async function (server, options) {
    options.production
      ? configureProduction(server)
      : configureDevelopment(server, options.webpackConfig)
  },
}

export default WebpackDevMiddlewarePlugin

function configureProduction(server: Hapi.Server) {
  server.route([
    {
      method: 'GET',
      path: '/{file}.{ext}',
      handler: (request, h) => {
        const { file, ext } = request.params

        switch (ext) {
          default:
            return h.continue
          case 'js':
          case 'css':
            return h.file(file + '.' + ext)
        }
      },
    },
    {
      method: '*',
      path: '/{any*}',
      handler: (_, h) => {
        return h.file('index.html')
      },
    },
  ])
}

function configureDevelopment(
  server: Hapi.Server,
  webpackConfig: Configuration
) {
  const onRequestMiddleware =
    (
      middleware: (
        request: IncomingMessage,
        response: ServerResponse,
        cb: (err: any) => void
      ) => void
    ): Hapi.Lifecycle.Method =>
    (request, h) => {
      return new Promise((resolve, reject) =>
        middleware(request.raw.req, request.raw.res, (err: any) => {
          err ? reject(err) : resolve(h.continue)
        })
      )
    }
  const compiler = Webpack(webpackConfig)
  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig?.output?.publicPath ?? '/',
  })
  const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
  })

  server.ext([
    { type: 'onRequest', method: onRequestMiddleware(devMiddleware) },
    { type: 'onRequest', method: onRequestMiddleware(hotMiddleware) },
  ])

  server.route({
    method: '*',
    path: '/{any*}',
    handler: (request, h) => {
      return new Promise((resolve, reject) => {
        const filename = Path.join(compiler.outputPath, 'index.html')
        compiler.outputFileSystem.readFile(filename, (err, result) =>
          err ? reject(err) : resolve(h.response(result))
        )
      })
    },
  })
}
