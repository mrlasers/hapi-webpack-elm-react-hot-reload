import Path from 'path'
import Webpack from 'webpack'

import Hapi from '@hapi/hapi'

import WebpackConfig, { mode } from '../webpack.config'
import DevMiddlewarePlugin from './webpack-dev-plugin'

async function init(
  port: number = 8000,
  host: string = 'localhost'
): Promise<Hapi.ServerInfo> {
  const server = Hapi.server({
    port: port,
    host: host,
    routes: {
      files: {
        relativeTo: Path.join(__dirname, '../client'),
      },
    },
  })

  await server.register([
    { plugin: require('blipp'), options: { showAuth: true } },
    require('@hapi/inert'),
  ])

  await server.register([
    {
      plugin: DevMiddlewarePlugin,
      options: {
        production: mode === 'production',
        webpackConfig: WebpackConfig,
      },
    },
  ])

  server.route([
    {
      method: 'GET',
      path: '/api/books/{bookId?}',
      handler: (request, h) => {
        return [
          {
            title: "Hello, World!: A Beginner's Guide to Ebook Development",
            author: 'Timothy Pew',
          },
        ]
      },
    },
  ])

  await server.start().catch(console.error)

  return server.info
}

init().then((info) => console.log(`Server running on ${info.uri}...`))
