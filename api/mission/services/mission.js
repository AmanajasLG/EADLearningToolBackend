'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  find(params, populate) {
    let p = [{path: 'locations', populate: 'backgroundAssets'}, {path: 'missionCharacters', populate: {
      path: 'character',
      populate: 'characterAssets'
    }}, 'questions', 'backgroundAudios', 'missionNameLanguages','missionDescriptionLanguages']
    return strapi.query('mission').find(params, p);
  },

  findOne(params, populate) {
    let p = [{path: 'locations', populate: 'backgroundAssets'}, {path: 'missionCharacters', populate: {
      path: 'character',
      populate: 'characterAssets'
    }}, 'questions', 'backgroundAudios', 'missionNameLanguages','missionDescriptionLanguages']
    return strapi.query('mission').findOne(params, p);
  },

  async update(params, data) {
    //how entry was
    const existingEntry = await strapi.query('mission').findOne(params.id);

    //validation and cleaning, don't know exaclty
    const draft = isDraft(existingEntry, strapi.models.mission);

    const validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.models.mission,
      data,
      { draft }
    );

    //create a missionData for each new character added (characters are IDs)
    validData.missionCharacters.map( async character => {
      let characterMissionData = existingEntry.missionCharacters.find( missionData => missionData.character === character.character )

      if(!characterMissionData){
        const characterDataEntry = await strapi.query('mission-character').create({
          ...character,
          character: character.character.id, 
          mission: existingEntry.id,
        });

        return characterDataEntry.id
      } 
    })

    //delete an existing missionData for each character removed
    existingEntry.missionCharacters.map( async characterMissionData => {
      if(!validData.missionCharacters.includes(characterMissionData.character)) {
        await strapi.query('mission-character').delete({id: characterMissionData.id})
      }
    })

    const entry = await strapi.query('mission').update(params, validData);

    return entry;
  },

  async create(params, data) {
    //how entry was
    const newEntry = await strapi.query('mission').create({});

    //validation and cleaning, don't know exaclty
    const draft = isDraft(newEntry, strapi.models.mission);

    const validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.models.mission,
      data,
      { draft }
    );

    //create a missionData for each new character added (characters are IDs)
    validData.missionCharacters.map( async character => {
      let characterMissionData = newEntry.missionCharacters.find( missionData => missionData.character === character )

      if(!characterMissionData){
        const characterDataEntry = await strapi.query('mission-character').create({
          ...character,
          character: character.character.id, 
          mission: newEntry.id,
        });

        return characterDataEntry.id
      }
    })

    const entry = await strapi.query('mission').create(params, validData);

    return entry;
  },
};
