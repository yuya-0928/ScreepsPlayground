const spawnAttacker = {
  run: function (spawn) {
    const newName = 'Attacker' + Game.time;
    console.log('Spawning new attacker: ' + newName);
    spawn.spawnCreep([ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName, {
      memory: { role: 'attacker' },
    });
  }
}

module.exports = spawnAttacker;