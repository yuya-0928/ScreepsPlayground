const spawnHealer = {
  run: function (spawn) {
    let newName = 'Healer' + Game.time;
    console.log('Spawning new healer: ' + newName);
    spawn.spawnCreep([HEAL, HEAL, MOVE, MOVE], newName, {
      memory: { role: 'healer' },
    });
  }
}

module.exports = spawnHealer;