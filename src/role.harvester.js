const findTarget = require('./findTarget');
const actionHarvest = require('./action.harvest');

const roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.refueling && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.refueling = false;
      const randTargetId = findTarget.randomSourcesFind(creep);
      creep.memory.harvestTargetId = randTargetId;
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
      actionHarvest.run(creep);
    } else {
      const targets = findTarget.filling(creep);
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
