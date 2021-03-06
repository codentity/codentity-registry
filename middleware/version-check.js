'use strict';

const Boom = require('boom');
const semver = require('semver');
const codentityVersion = require('../package').codentityVersion;

function register (server, options, next) {
  server.ext('onRequest', function (request, reply) {
    const version = request.headers['x-codentity-version'];
    if (!version) {
      let msg = `Missing "x-codentity-version" header`;
      return reply(Boom.badRequest(msg));
    }
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
