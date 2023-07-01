const roleHealer = {
  run: function (creep) {
    const targets = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
      filter: function (object) {
        return object.hits < object.hitsMax;
      }
    });

    if (targets) {
      if (creep.heal(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ff0000' } });
      }
    }
  }
}

module.exports = roleHealer;