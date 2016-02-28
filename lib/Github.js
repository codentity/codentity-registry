'use strict';

const Request = require('./Request');
const REPO = 'codentity/codentity-packages';
const RAW_URL = `https://raw.githubusercontent.com/${REPO}/master/packages`;
const CONTENTS_URL = `https://api.github.com/repos/${REPO}/contents/packages`;

class Github {
  constructor (options) {
    options = options || {};
    this._baseUrl = options.baseUrl;
    let headers = {};
    if (options.userAgent) headers['User-Agent'] = options.userAgent;
    if (options.token) headers['Authorization'] = `token ${options.token}`;
    this._request = new Request({ headers: headers });
  }
  getPackages () {
    return this._getPackageIndex()
    .then((packages) => {
      return Promise.all(packages.map((pkg) => {
        return this.getPackageConfig(pkg.name);
      }));
    });
  }
  getImageUrl (pkgName) {
    return `${RAW_URL}/${pkgName}/icon.png`;
  }
  getPackageConfig (pkgName) {
    return this._getFromApi(`${RAW_URL}/${pkgName}/config.json`)
    .then((config) => {
      config.id = pkgName;
      config.url = `${this._baseUrl}/packages/${pkgName}`;
      config.imageUrl = this.getImageUrl(pkgName);
      return config;
    });
  }
  _getPackageIndex (pkgName) {
    return this._getFromApi(CONTENTS_URL, true);
  }
  _getFromApi (url, ignoreCache) {
    return this._request.get(url, ignoreCache).then(function (result) {
      return result;
    });
  }
}

module.exports = Github;
