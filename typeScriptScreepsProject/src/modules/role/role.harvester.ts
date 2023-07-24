import { findTarget } from "../findTarget";
import { actionHarvest } from "../action/action.harvest";
import { memoryManager } from "../memoryManager";
import { CreepMemory } from "../../main";
import { isCreepStoreEmpty, isCreepStoreFull } from "../check/check.store";
import { actionMove } from "../action/action.move";

const isHarvesting = (creep: Creep) => {
  return (creep.memory as CreepMemory).refueling;
};

export const roleHarvester = {
  run: function (creep: Creep) {
    (creep.memory as CreepMemory).roleAs = "harvester";

    // TODO: Creepが作りたての状態を考慮できていないため、roleのみが設定された状態のCreepの扱いを決める
    switch (isHarvesting(creep)) {
      case true:
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).refueling = false;
          const randTargetId = findTarget.randomSourcesFind(creep);
          (creep.memory as CreepMemory).harvestTargetId = randTargetId;
          creep.say("🔄 harvest");
          break;
        }

        const targets = findTarget.filling(creep);
        if (targets.length > 0) {
          // TODO: Creepの動作状態をMemoryに保存
          if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            actionMove(creep, targets[0]);
          }
        }
        break;

      case false:
        // TODO: Creepが作りたての状態が決まったら削除する
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).refueling = false;
          const randTargetId = findTarget.randomSourcesFind(creep);
          (creep.memory as CreepMemory).harvestTargetId = randTargetId;
          creep.say("🔄 harvest");
          break;
        }

        if (isCreepStoreFull(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).refueling = true;
          creep.say("⛽ refuel");
          break;
        }

        // TODO: Creepの動作状態をMemoryに保存
        actionHarvest.run(creep);
        break;
    }
  },
};
