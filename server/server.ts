import Path from 'path'

import Hapi from '@hapi/hapi'

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

  server.route({
    method: '*',
    path: '/{any*}',
    handler: (request, h) => {
      return `Hapi server has not yet been implemented.`
    },
  })

  await server.start().catch(console.error)

  return server.info
}

init().then((info) => console.log(`Server running on ${info.uri}...`))
