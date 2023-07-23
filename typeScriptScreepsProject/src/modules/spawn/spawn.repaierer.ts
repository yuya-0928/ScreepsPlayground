import { creepStatus } from "../../managementCreepCount";

export const spawnRepaierer = {
  run: function (spawn: StructureSpawn) {
    const newName = "Repaierer" + Game.time;
    console.log("Spawning new repaierer: " + newName);
    spawn.spawnCreep(creepStatus.repaierer, newName, {
      memory: { role: "repaierer" },
    });
  },
};
