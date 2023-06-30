const registMemorySource = require('registMemory.source');

const roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.refueling && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.refueling = false;
      registMemorySource.randomFind(creep);
      creep.say('🔄 harvest');
    }

    if (
      !creep.memory.refueling &&
      creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0
    ) {
      creep.memory.refueling = true;
      creep.say('⛽ refuel');
    }

    if (!creep.memory.refueling) {
      if (creep.memory.harvestTargetId) {
        const sources = [];
        sources.push(Game.getObjectById(creep.memory.harvestTargetId));
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      } else {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      }

    } else {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_TOWER ||
              structure.structureType == STRUCTURE_CONTAINER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: '#ffffff' },
          });
        }
      }
    }
  },
};

module.exports = roleHarvester;
