const actionHarvest = {
  run: function (creep) {
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
  }
}

module.exports = actionHarvest;