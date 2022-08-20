import Path from 'path'
import Webpack from 'webpack'

import Hapi from '@hapi/hapi'

import WebpackConfig, { mode } from '../webpack.config'

async function init(
  port: number = 8000,
  host: string = 'localhost'
): Promise<Hapi.ServerInfo> {
  const server = Hapi.server({
    port: port,
    host: host,
    routes: {
      files: {
        relativeTo: Path.join(__dirname, '../public'),
      },
    },
  })

  await server.register([
    { plugin: require('blipp'), options: { showAuth: true } },
    require('@hapi/inert'),
  ])

  if (mode !== 'development') {
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

  if (mode === 'development') {
    const compiler = Webpack(WebpackConfig)
    const devMiddleware = require('webpack-dev-middleware')(compiler, {
      publicPath: WebpackConfig.output.publicPath,
    })
    const hotMiddleware = require('webpack-hot-middleware')(compiler, {
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
