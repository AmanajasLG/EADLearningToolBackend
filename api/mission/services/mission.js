'use strict';
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

const { isDraft } = require('strapi-utils').contentTypes;

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
      const existingEntry = await strapi.query('mission').findOne(params);
            
      //validation and cleaning, don't know exaclty
      const draft = isDraft(existingEntry, strapi.models.mission);

      const createData = [...data.missionCharactersCreate];
      delete data.missionCharactersCreate;

      let validData = await strapi.entityValidator.validateEntityUpdate(
        strapi.models.mission,
        data,
        { draft }
      );

      //create a missionData for each new character added (characters are IDs)
      createData.map( async (missionCharacter, index) => {
        let characterMissionData = existingEntry.missionCharacters.find( missionData => missionData.character.toString() === missionCharacter.character.id )
    
        if(!characterMissionData){
          const characterDataEntry = await strapi.query('mission-character').create({
            ...missionCharacter,
            character: missionCharacter.character.id,
            mission: existingEntry.id,
          });
        }
      })

      //delete an existing missionData for each character removed
      existingEntry.missionCharacters.map( async characterMissionData => {
        if(!validData.missionCharacters.includes(characterMissionData.id)) {
          await strapi.query('mission-character').delete({id: characterMissionData.id})
        }
      })
      
      const entry = await strapi.query('mission').update(params, validData);

      return entry;
  },

  async create(data) {
    //how entry was
    const existingEntry = await strapi.query('mission').findOne(params);
            
    //validation and cleaning, don't know exaclty
    const draft = isDraft(existingEntry, strapi.models.mission);

    const createData = [...data.missionCharactersCreate];
    delete data.missionCharactersCreate;

    let validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.models.mission,
      data,
      { draft }
    );

    //create a missionData for each character added
    createData.map( async (missionCharacter, index) => {
      let characterMissionData = existingEntry.missionCharacters.find( missionData => missionData.character.toString() === missionCharacter.character.id )
  
      if(!characterMissionData){
        const characterDataEntry = await strapi.query('mission-character').create({
          ...missionCharacter,
          character: missionCharacter.character.id,
          mission: existingEntry.id,
        });
      }
    })
    
    const entry = await strapi.query('mission').update(params, validData);

    return entry;
  },
};
