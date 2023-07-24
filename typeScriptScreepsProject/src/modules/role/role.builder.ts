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

    // TODO: Creepが作りたての状態を考慮できていないため、roleのみが設定された状態のCreepの扱いを決める
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
        // TODO: Creepが作りたての状態が決まったら削除する
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          const randTargetId = findTarget.randomSourcesFind(creep);
          (creep.memory as CreepMemory).building = false;
          (creep.memory as CreepMemory).harvestTargetId = randTargetId;
          creep.say("🔄 harvest");
          break;
        }

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
