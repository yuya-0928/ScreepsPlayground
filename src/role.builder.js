/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

var getRandomInt = require('getRandomInt');

var roleBuilder = {

  /** @param {Creep} creep **/
  run: function (creep) {

    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;

      var sources = creep.room.find(FIND_SOURCES);
      var randTargetId = sources[getRandomInt(sources.length)].id
      creep.memory.harvestTargetId = randTargetId;

      creep.say('🔄 harvest');
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say('🚧 build');
    }

    if (creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
    else {
      if (creep.memory.harvestTargetId) {
        var sources = []
        sources.push(Game.getObjectById(creep.memory.harvestTargetId));
      } else {
        var sources = creep.room.find(FIND_SOURCES);
      }
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  }
};

module.exports = roleBuilder;