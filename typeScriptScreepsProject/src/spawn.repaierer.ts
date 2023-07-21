export const spawnRepaierer = {
  run: function (spawn: StructureSpawn) {
    const newName = "Repaierer" + Game.time;
    console.log("Spawning new repaierer: " + newName);
    spawn.spawnCreep(
      [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      newName,
      {
        memory: { role: "repaierer" },
      }
    );
  },
};

module.exports = spawnRepaierer;
