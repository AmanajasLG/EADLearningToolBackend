'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  find(params, populate) {
    let p = ['user', 'mission']
    return strapi.query('user-game-result').find(params, p);
  },

  findOne(params, populate) {
    let p = ['user', 'mission']
    return strapi.query('user-game-result').findOne(params, p);
  },
};
