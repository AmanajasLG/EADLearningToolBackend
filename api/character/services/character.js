'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  find(params, populate) {
    let p = [{path: 'missions', populate: 'questions'}]
    return strapi.query('character').find(params, p);
  }
};
