import { CreepMemory } from "../main";

export const spawnerStatus = {
  show: function (spawn: StructureSpawn) {
    if (spawn.spawning) {
      const spawningCreep = Game.creeps[spawn.spawning.name];
      spawn.room.visual.text(
        "🛠️" + (spawningCreep.memory as CreepMemory).role,
        spawn.pos.x + 1,
        spawn.pos.y,
        { align: "left", opacity: 0.8 }
      );
    }
  },
};
