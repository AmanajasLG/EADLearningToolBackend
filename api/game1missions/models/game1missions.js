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
      data.characters.map(async character => {
        let characterMissionData = data.game_1_mission_characters.find(missionData => missionData.character === character)

        if (!characterMissionData) {
          const characterDataEntry = await strapi.query('game1mission-character').create({ character: character, game_1_mission: data.id });
          data.game_1_mission_characters = [...data.game_1_mission_characters, characterDataEntry.id]
          console.log('characterDataEntry:', characterDataEntry)
        }
      })

      //delete an existing missionData for each character removed
      data.game_1_mission_characters.map(async characterMissionData => {
        if (!data.characters.includes(characterMissionData.character)) {
          await strapi.query('game1mission-character').delete({ id: characterMissionData.id })
        }
      })

    },

    async afterUpdate(result, params, data){
      console.log('after update')

      console.log('result:', result)
      console.log('params:', params)
      console.log('data:', data)

      //create a missionData for each new character added (characters are IDs)
    }
  }
};
