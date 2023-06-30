const spawnUpgrader = {
  run: function (spawn) {
    const newName = 'Upgrader' + Game.time;
    console.log('Spawning new harvester: ' + newName);
    spawn.spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName, {
      memory: { role: 'upgrader' },
    });
  }
}

module.exports = spawnUpgrader;