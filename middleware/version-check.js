'use strict';

const Boom = require('boom');
const semver = require('semver');
const codentityVersion = require('../package');

function register (server, options, next) {
  server.ext('onRequest', function (request, reply) {
    const version = request.headers.version;
    if (!semver.valid(version)) {
      let msg = `Invalid Codentity version: ${version}`;
      return reply(Boom.badRequest(msg));
    }
    if (!semver.satisfies(version, codentityVersion)) {
      let msg = 'Deprecated Codentity version. Please upgrade using `npm update -g codentity`';
      return reply(Boom.badRequest(msg));
    }
    reply.continue();
  });
  next();
}

register.attributes = {
  name: 'version-check'
};

module.exports = {
  register: register
};
