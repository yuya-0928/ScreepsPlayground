const getRandomInt = require('getRandomInt');

const findTarget = {
  filling: (creep) => {
    return creep.room.find(FIND_STRUCTURES, {
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
  },

  attackTarget: (creep) => {
    return creep.room.find(FIND_HOSTILE_CREEPS);
  },

  randomSourcesFind: function (creep) {
    const sources = creep.room.find(FIND_SOURCES_ACTIVE, { filter: (source) => { return source.energy > 0 } });
    if (sources.length === 0) {
      return findTarget.randomContainersFind(creep);
    }
    return sources[getRandomInt(sources.length)].id;
  },

  randomContainersFind: function (creep) {
    const containers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_CONTAINER &&
          structure.store.getCapacity() > 0
        );
      },
    });
    return containers[getRandomInt(containers.length)].id;
  }
}

module.exports = findTarget;