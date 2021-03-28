'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  find(params, populate) {
    let p = [
      {path: 'locations', populate: 'backgroundAssets'},
      {path: 'characters', populate: ['characterAssets', 'game_1_mission_characters']},
      'questions',
      'backgroundAudios'
    ]
    return strapi.query('game1missions').find(params, p);
  },

  findOne(params, populate) {
    let p = [
      {path: 'locations', populate: 'backgroundAssets'},
      {path: 'characters', populate: ['characterAssets', 'game_1_mission_characters']},
      'questions',
      'backgroundAudios'
    ]
    return strapi.query('game1missions').findOne(params, p);
  },
};
