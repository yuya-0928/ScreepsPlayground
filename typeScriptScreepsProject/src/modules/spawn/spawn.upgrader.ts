import { creepStatus } from "../../managementCreep";

export const spawnUpgrader = {
  run: function (spawn: StructureSpawn) {
    const newName = "Upgrader" + Game.time;
    console.log("Spawning new harvester: " + newName);
    spawn.spawnCreep(creepStatus.upgrader, newName, {
      memory: { role: "upgrader" },
    });
  },
};
