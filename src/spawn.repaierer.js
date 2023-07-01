const spawnRepaierer = {
  run: function (spawn) {
    const newName = 'Repaierer' + Game.time;
    console.log('Spawning new repaierer: ' + newName);
    spawn.spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName, {
      memory: { role: 'repaierer' },
    });
  }
}

module.exports = spawnRepaierer;