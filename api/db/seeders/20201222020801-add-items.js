'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Items', [{
      username: 'john.doe@example.com',
      password: 'P@$sw0rD',
      website: 'http://site1.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      username: 'john.doe@example.com',
      password: 'P@$sw0rD',
      website: 'http://site2.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      username: 'john.doe@example.com',
      password: 'P@$sw0rD',
      website: 'http://site3.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};