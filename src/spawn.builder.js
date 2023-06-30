const spawnBuilder = {
  run: function (spawn) {
    const newName = 'Builder' + Game.time;
    console.log('Spawning new builder: ' + newName);
    spawn.spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName, {
      memory: { role: 'builder' },
    });
  }
}

module.exports = spawnBuilder;