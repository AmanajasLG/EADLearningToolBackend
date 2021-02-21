'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  //deletes a playSession with all its playerActions
  async delete(params) {
    let playSession = await strapi.query('play-session').findOne(params)
    playSession.player_actions.map(playerAction => strapi.query('player-action').delete({id:playerAction}))
    return strapi.query('play-session').delete(params);
  },
};
