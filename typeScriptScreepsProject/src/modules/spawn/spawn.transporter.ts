import { creepStatus } from "../../managementCreep";

export const spawnTransporter = {
  run: function (spawn: StructureSpawn) {
    const newName = "Transporter" + Game.time;
    console.log("Spawning new transporter: " + newName);
    spawn.spawnCreep(creepStatus.upgrader, newName, {
      memory: { role: "transporter" },
    });
  },
};
