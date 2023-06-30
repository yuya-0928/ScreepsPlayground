/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

var getRandomInt = require('getRandomInt');

var roleHarvester = {

  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.refueling && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.refueling = false;

      var sources = creep.room.find(FIND_SOURCES);
      var randTargetId = sources[getRandomInt(sources.length)].id
      creep.memory.harvestTargetId = randTargetId;

      creep.say('🔄 harvest');
    }

    if (!creep.memory.refueling && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
      creep.memory.refueling = true;
      creep.say('⛽ refuel');
    }

    if (!creep.memory.refueling) {
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
    else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }
};

module.exports = roleHarvester;