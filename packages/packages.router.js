'use strict';

const Controller = require('./packages.controller');

module.exports = function (server) {
  server.route({
    path: '/packages',
    method: 'GET',
    handler: Controller.list
  });
  server.route({
    path: '/packages/{id}',
    method: 'GET',
    handler: Controller.getPackageInfo
  });
  server.route({
    path: '/packages/{id}/icon',
    method: 'GET',
    handler: Controller.getImage
  });
};
