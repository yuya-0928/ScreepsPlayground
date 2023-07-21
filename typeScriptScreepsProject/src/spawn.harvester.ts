export const spawnHarvester = {
  run: function (spawn: StructureSpawn) {
    let newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    spawn.spawnCreep(
      [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      newName,
      {
        memory: { role: "harvester" },
      }
    );
  },
};

module.exports = spawnHarvester;
