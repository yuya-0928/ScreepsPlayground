const findTarget = require("./findTarget");

const actionHarvest = {
  run: function (creep) {
    if (creep.memory.harvestTargetId) {
      const sources = [];
      sources.push(Game.getObjectById(creep.memory.harvestTargetId));

      switch (creep.harvest(sources[0])) {
        case ERR_NOT_IN_RANGE: {
          creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
          break;
        }

        case ERR_NOT_ENOUGH_RESOURCES || ERR_INVALID_TARGET: {
          const targetId = findTarget.randomSourcesFind(creep);
          if (targetId) {
            creep.memory.harvestTargetId = targetId;
          } else if (creep.memory.role !== 'harvester') {
            const targetId = findTarget.randomContainersFind(creep);
            creep.memory.harvestTargetId = targetId;
          }
          break;
        }
      }

    } else {
      const randTargetId = findTarget.randomSourcesFind(creep);
      creep.memory.harvestTargetId = randTargetId;
    }
  }
}

module.exports = actionHarvest;