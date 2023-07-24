import { findTarget } from "../findTarget";
import { actionHarvest } from "../action/action.harvest";
import { memoryManager } from "../memoryManager";
import { CreepMemory } from "../../main";
import { actionMove } from "../action/action.move";
import { isCreepStoreEmpty, isCreepStoreFull } from "../check/check.store";

const isBuilding = (creep: Creep) => {
  return (creep.memory as CreepMemory).building;
};

export const roleBuilder = {
  run: (creep: Creep) => {
    (creep.memory as CreepMemory).roleAs = "builder";

    switch (isBuilding(creep)) {
      case true:
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          const randTargetId = findTarget.randomSourcesFind(creep);
          (creep.memory as CreepMemory).building = false;
          (creep.memory as CreepMemory).harvestTargetId = randTargetId;
          creep.say("🔄 harvest");
          break;
        }

        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
          if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
            // TODO: Creepの動作状態をMemoryに保存
            actionMove(creep, targets[0]);
          }
        }
        break;

      case false:
        if (isCreepStoreFull(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).building = true;
          creep.say("🚧 build");
          break;
        }

        // TODO: Creepの動作状態をMemoryに保存
        actionHarvest.run(creep);
        break;
    }
  },
};
