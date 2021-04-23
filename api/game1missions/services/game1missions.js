'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */
const { isDraft } = require('strapi-utils').contentTypes;

module.exports = {
  find(params, populate) {
    let p = [
      { path: 'locations', populate: 'backgroundAssets' }, ,
      'questions',
      'background_audios',
      { path: 'game_1_mission_characters', populate: [{ path: 'character', populate: ['characterAssets'] }, 'answers'] },
      'missionNameLanguages',
      'missionDescriptionLanguages'
    ]
    return strapi.query('game1missions').find(params, p);
  },

  findOne(params, populate) {
    let p = [
      { path: 'locations', populate: 'backgroundAssets' },
      'questions',
      'background_audios',
      { path: 'game_1_mission_characters', populate: [{ path: 'character', populate: ['characterAssets'] }, 'answers'] },
      'missionNameLanguages',
      'missionDescriptionLanguages'
    ]
    return strapi.query('game1missions').findOne(params, p);
  },

  async update(params, data, { files } = {}) {
    //how entry was
    const existingEntry = await strapi.query('game1missions').findOne(params);

    //validation and cleaning, don't know exaclty
    const draft = isDraft(existingEntry, strapi.models.game1mission);

    const validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.models.game1mission,
      data,
      { draft }
    );

    const entry = await strapi.query('game1missions').update(params, validData);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await strapi.entityService.uploadFiles(entry, files, {
        model: 'game1missions',
        // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
      });
      return this.findOne({ id: entry.id });
    }

    return entry;
  },
};
