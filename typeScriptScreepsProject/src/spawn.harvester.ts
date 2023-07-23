import { creepStatus } from "./managementCreepCount";

export const spawnHarvester = {
  run: function (spawn: StructureSpawn) {
    let newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    spawn.spawnCreep(creepStatus.harvester, newName, {
      memory: { role: "harvester" },
    });
  },
};
