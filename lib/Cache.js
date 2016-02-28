'use strict';

const MINUTES = 60 * 1000;
const DEFAULT_DURATION = 5 * MINUTES;

class Cache {
  constructor (config) {
    config = config || {};
    this.duration = config.duration || DEFAULT_DURATION;
    this.cache = {};
  }
  add (key, data) {
    this.cache[key] = {
      timestamp: new Date(),
      data: data
    };
  }
  get (key) {
    let cache = this.cache[key];
    if (!cache) return;
    let now = new Date();
    if (now - cache.timestamp > this.duration) {
      delete this.cache[key];
    } else {
      return cache.data;
    }
  }
}

module.exports = Cache;
