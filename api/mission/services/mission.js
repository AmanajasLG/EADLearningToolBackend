'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  find(params, populate) {
    let p = [{path: 'locations', populate: 'backgroundAssets'}, {path: 'characters', populate: 'characterAssets'}, 'questions', 'backgroundAudios']
    return strapi.query('mission').find(params, p);
  },

  findOne(params, populate) {
    let p = [{path: 'locations', populate: 'backgroundAssets'}, {path: 'characters', populate: 'characterAssets'}, 'questions', 'backgroundAudios']
    return strapi.query('mission').findOne(params, p);
  },
};
