'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */
const { isDraft } = require('strapi-utils').contentTypes;

module.exports = {
  find(params, populate) {
    let p = [
      { path: 'locations', populate: 'backgroundAssets' },
      { path: 'characters', populate: ['characterAssets', 'game_1_mission_characters'] },
      'questions',
      'backgroundAudios',
      'game_1_mission_characters',
      'missionNameLanguages',
      'missionDescriptionLanguages'
    ]
    return strapi.query('game1missions').find(params, p);
  },

  findOne(params, populate) {
    let p = [
      { path: 'locations', populate: 'backgroundAssets' },
      { path: 'characters', populate: ['characterAssets', 'game_1_mission_characters'] },
      'questions',
      'backgroundAudios',
      'game_1_mission_characters',
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

    //create a missionData for each new character added (characters are IDs)
    validData.characters.map(async character => {
      let characterMissionData = existingEntry.game_1_mission_characters.find(missionData => missionData.character === character)

      if (!characterMissionData) {
        const characterDataEntry = await strapi.query('game1mission-character').create({ character: character, game_1_mission: existingEntry.id });
      }
    })

    //delete an existing missionData for each character removed
    existingEntry.game_1_mission_characters.map(async characterMissionData => {
      if (!validData.characters.includes(characterMissionData.character)) {
        await strapi.query('game1mission-character').delete({ id: characterMissionData.id })
      }
    })

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
