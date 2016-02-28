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
    let github = getGithubInstance(request);
    github.getPackages()
    .then(function (packages) {
      if (request.query.format === 'lite') {
        return packages.map((pkg) => {
          return {
            id: pkg.id,
            bower: pkg.bower,
            npm: pkg.npm,
            file: pkg.file,
            gem: pkg.gem,
            pip: pkg.pip,
            composer: pkg.composer
          };
        });
      }
      return packages;
    }).then((packages) => {
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
