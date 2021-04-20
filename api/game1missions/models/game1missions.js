'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles:{
    async beforeUpdate(params, data){
      console.log('before update')
      console.log('params:', params)
      console.log('data:', data)
      delete data.game_1_mission_characters
    },

    async afterUpdate(result, params, data){
      console.log('after update')
      const populate = [
        {
          path: 'characters',
          populate: 'game_1_mission_characters'
        },
        'game_1_mission_characters'
      ]
      const fromDB = await strapi.query('game1missions').findOne({id: result.id}, populate)
      console.log('result:', result)
      console.log('params:', params)
      console.log('data:', data)
      console.log('fromDB:', fromDB)

      fromDB.characters.map(async character => {
        if(!character.game_1_mission_characters.find( g1mc => {
          console.log('g1mc.game_1_mission:', `${g1mc.game_1_mission}`);
          console.log('result._id', `${result._id}`);
          console.log('===?', `${g1mc.game_1_mission}` === `${result._id}`)
          return `${g1mc.game_1_mission}` === `${result._id}`
        })){
          console.log('create characterMissionData for', character)
          const characterDataEntry = await strapi.query('game1mission-character').create({ character: character.id, game_1_mission: result.id });
          console.log('created characterDataEntry:', characterDataEntry)
        }
      })


      //delete an existing missionData for each character removed
      console.log('check missionData for each character removed')
      console.log('currently:', data.game_1_mission_characters)
      fromDB.game_1_mission_characters.map(async characterMissionData => {
        if (!data.characters.includes(`${characterMissionData.character}`)) {
          console.log(`character ${characterMissionData.character} removed. Deleting characterMissionData..`)
          await strapi.query('game1mission-character').delete({ id: characterMissionData.id })
        }
      })

      //create a missionData for each new character added (characters are IDs)
    }
  }
};
