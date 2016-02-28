'use strict';

const Github = require('../lib/Github');
const pkgJson = require('../package');

module.exports = {
  getImage: function (request, reply) {
    let github = getGithubInstance(request);
    let imageUrl = github.getImageUrl(request.params.id);
    reply.redirect(imageUrl);
  },
  getPackageInfo: function (request, reply) {
    let github = getGithubInstance(request);
    github.getPackageConfig(request.params.id)
    .then(function (config) {
      reply(config);
    })
    .catch(handleError(reply));
  },
  list: function (request, reply) {
    console.log(request.headers);
    let github = getGithubInstance(request);
    github.getPackages()
    .then(function (packages) {
      reply(packages)
      .header('total-items', packages.length);
    })
    .catch(handleError(reply));
  }
};

function handleError (reply) {
  return function (err) {
    reply({
      statusCode: err.statusCode,
      message: err.message
    })
    .code(err.statusCode || 500);
  };
}

function getGithubInstance (request) {
  let baseUrl = `${request.server.info.protocol}://${request.info.host}`;
  return new Github({
    baseUrl: baseUrl,
    token: process.env.GITHUB_TOKEN,
    userAgent: process.env.GITHUB_USER_AGENT || pkgJson.name
  });
}
