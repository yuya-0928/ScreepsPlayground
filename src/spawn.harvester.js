const spawnHarvester = {
  run: function (spawn) {
    let newName = 'Harvester' + Game.time;
    console.log('Spawning new harvester: ' + newName);
    spawn.spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName, {
      memory: { role: 'harvester' },
    });
  }
}

module.exports = spawnHarvester;