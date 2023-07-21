import { findTarget } from "./findTarget";
import { CreepMemory } from "./main";

export const actionHarvest = {
  run: function (creep: Creep) {
    if ((creep.memory as CreepMemory).harvestTargetId) {
      const sources: (Source | Mineral<MineralConstant> | Deposit)[] = [];
      sources.push(
        Game.getObjectById((creep.memory as CreepMemory).harvestTargetId) as
          | Source
          | Mineral<MineralConstant>
          | Deposit
      );
      switch (creep.harvest(sources[0])) {
        case ERR_NOT_IN_RANGE: {
          creep.moveTo(sources[0], {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
          break;
        }

        case ERR_NOT_ENOUGH_RESOURCES || ERR_INVALID_TARGET: {
          const targetId = findTarget.randomSourcesFind(creep);
          if (targetId) {
            (creep.memory as CreepMemory).harvestTargetId = targetId;
          }
          break;
        }
      }
    } else {
      const randTargetId = findTarget.randomSourcesFind(creep);
      (creep.memory as CreepMemory).harvestTargetId = randTargetId;
    }
  },
};
