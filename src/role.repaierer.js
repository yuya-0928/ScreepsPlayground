const findTarget = require('./findTarget');
const actionHarvest = require('./action.harvest');

const roleRepaierer = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.repaiering && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.repaiering = false;
      const randTargetId = findTarget.randomSourcesFind(creep);
      creep.memory.harvestTargetId = randTargetId;
      creep.say('🔄 harvest');
    }

    if (!creep.memory.repaiering && creep.store.getFreeCapacity() == 0) {
      creep.memory.repaiering = true;
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax
      });
      targets.sort((a, b) => a.hits - b.hits);
      const targetId = targets[0].id;
      creep.memory.repaierTargetId = targetId;
      creep.say('🔧 repaier');
    }

    if (creep.memory.repaiering) {
      if (creep.memory.repaierTargetId) {
        const targets = [];
        targets.push(Game.getObjectById(creep.memory.repaierTargetId));
        if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: '#ffffff' },
          });
        }
      } else {
        const targets = creep.room.find(FIND_STRUCTURES, {
          filter: object => object.hits < object.hitsMax
        });
        targets.sort((a, b) => a.hits - b.hits);
        if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: '#ffffff' },
          });
        }
      }
    } else {
      actionHarvest.run(creep);
    }
  },
};

module.exports = roleRepaierer;
