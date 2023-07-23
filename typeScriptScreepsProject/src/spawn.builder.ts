import { creepStatus } from "./managementCreepCount";

export const spawnBuilder = {
  run: function (spawn: StructureSpawn) {
    const newName = "Builder" + Game.time;
    console.log("Spawning new builder: " + newName);
    spawn.spawnCreep(creepStatus.builder, newName, {
      memory: { role: "builder" },
    });
  },
};
