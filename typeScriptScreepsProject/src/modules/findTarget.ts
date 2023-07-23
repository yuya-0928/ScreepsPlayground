import { getRandomInt } from "./getRandomInt";

export const findTarget = {
  filling: (creep: Creep) => {
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

  sourceBuildingCreep: () => {
    const sources = Game.spawns["Spawn1"].room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN
        );
      },
    });
    let sourceStorage = 0;
    sources.forEach((source) => {
      switch (source.structureType) {
        case STRUCTURE_EXTENSION:
          sourceStorage += source.store.getCapacity(RESOURCE_ENERGY);
          break;
        case STRUCTURE_SPAWN:
          sourceStorage += source.store.getCapacity(RESOURCE_ENERGY);
          break;
      }
    });
    return sourceStorage;
  },

  attackTarget: (creep: Creep) => {
    return creep.room.find(FIND_HOSTILE_CREEPS);
  },

  randomSourcesFind: function (creep: Creep) {
    const sources = creep.room.find(FIND_SOURCES_ACTIVE, {
      filter: (source) => {
        return source.energy > 0;
      },
    });
    if (sources.length === 0) {
      return findTarget.randomContainersFind(creep);
    }
    return sources[getRandomInt(sources.length)].id;
  },

  randomContainersFind: function (creep: Creep) {
    const containers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_CONTAINER &&
          structure.store[RESOURCE_ENERGY] > 0
        );
      },
    });
    return containers[getRandomInt(containers.length)].id;
  },
};
