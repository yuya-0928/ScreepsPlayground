const findTarget = require('./findTarget');
const actionHarvest = require('./action.harvest');

const roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      const randTargetId = findTarget.randomSourcesFind(creep);
      creep.memory.harvestTargetId = randTargetId;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      creep.say('⚡ upgrade');
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: { stroke: '#ffffff' },
        });
      }
    } else {
      actionHarvest.run(creep);
    }
  },
};

module.exports = roleUpgrader;
