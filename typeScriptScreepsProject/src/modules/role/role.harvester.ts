import { findTarget } from "../findTarget";
import { actionHarvest } from "../action/action.harvest";
import { memoryManager } from "../memoryManager";
import { CreepMemory } from "../../main";

const isHarvesting = (creep: Creep) => {
  return (creep.memory as CreepMemory).refueling;
};

export const roleHarvester = {
  run: function (creep: Creep) {
    if (isHarvesting(creep) && creep.store[RESOURCE_ENERGY] == 0) {
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).refueling = false;
      const randTargetId = findTarget.randomSourcesFind(creep);
      (creep.memory as CreepMemory).harvestTargetId = randTargetId;
      (creep.memory as CreepMemory).roleAs = "harvester";
      creep.say("🔄 harvest");
    }

    if (
      !isHarvesting(creep) &&
      creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0
    ) {
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).refueling = true;
      (creep.memory as CreepMemory).roleAs = "harvester";
      creep.say("⛽ refuel");
    }

    if ((creep.memory as CreepMemory).refueling) {
      const targets = findTarget.filling(creep);
      if (targets.length > 0) {
        // TODO: Creepの動作状態をMemoryに保存
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      }
    } else {
      // TODO: Creepの動作状態をMemoryに保存
      actionHarvest.run(creep);
    }
  },
};
