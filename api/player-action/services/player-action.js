'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

const { isDraft } = require('strapi-utils').contentTypes;

module.exports = {

   async create(data, { files } = {}) {
    const isD = isDraft(data, strapi.models['player-action']);


    const validData = await strapi.entityValidator.validateEntityCreation(
      strapi.models.player_action,
      data,
      { isD }
    );

    const entry = await strapi.query('player-action').create(validData);

    //  checks if a playSession id was passed with charData
    if(data.play_session){
      let playSession = await strapi.query('play-session').findOne({id: data.play_session});
      //  and associates the created register to that playsession
      if(playSession)
        await strapi.query('play-session').update({id: playSession.id}, {player_actions: [...playSession.player_actions, entry.id]});
    }

    if (files) {
      // automatically uploads the files based on the entry and the model
      await strapi.entityService.uploadFiles(entry, files, {
        model: 'player_action',
        // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
      });
      return this.findOne({ id: entry.id });
    }

    return entry;
  }

};
