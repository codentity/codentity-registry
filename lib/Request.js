'use strict';

const request = require('request');
const Cache = require('./Cache');

let _cache = new Cache();

class Request {
  constructor (options) {
    this._headers = options.headers || {};
  }
  get (url) {
    let config = {
      headers: this._headers,
      method: 'GET',
      url: url,
      json: true
    };
    return new Promise((resolve, reject) => {
      request(config, (err, response, body) => {
        if (err) return reject(err);
        if (this._isValidResponse(response)) {
          _cache.add(url, body);
          return resolve(body);
        }
        let error = this._getRejection(response, body);
        return reject(error);
      });
    });
  }
  _isValidResponse (response) {
    return (response.statusCode === 200 || response.statusCode === 304);
  }
  _getRejection (response, body) {
    let error = new Error(body.message || response.statusMessage || body);
    error.statusCode = response.statusCode;
    error.response = response;
    return error;
  }
}

module.exports = Request;
