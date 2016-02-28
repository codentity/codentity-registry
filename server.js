'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server({
  debug: {
    request: ['error', 'uncaught']
  }
});

const packageJson = require('./package');

server.connection({
  port: process.env.PORT || 5000
});

require('./packages/packages.router')(server);

server.route({
  path: '/',
  method: 'GET',
  handler: (request, reply) => {
    reply({
      name: packageJson.name,
      message: packageJson.description,
      version: packageJson.version,
      packagesUrl: `${request.server.info.protocol}://${request.info.host}/packages`
    });
  }
});

server.register([
  require('./middleware/version-check')
], (err) => {
  if (err) throw err;
  server.start((err) => {
    if (err) throw err;
    console.log('Server listening on', server.info.uri);
  });
});
