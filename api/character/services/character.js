'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  find(params, populate) {
    let p = [{path: 'missions', populate: 'questions'}]
    return strapi.query('character').find(params, p);
  },



  findOne(params, populate) {
    console.log('findOne called')
    let p = [{path: 'missions', populate: 'questions'}]
    return strapi.query('character').findOne(params, p);
  },

  async update(params, data, { files } = {}) {
    console.log('update called')
    const validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.models.character,
      data
    );
    const entry = await strapi.query('character').update(params, validData);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await strapi.entityService.uploadFiles(entry, files, {
        model: 'character',
        // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
      });
      let result = this.findOne({ id: entry.id });
      console.log('result:', result)
      return result;
    }
    console.log('entry:', entry)
    return entry;
  }
};
