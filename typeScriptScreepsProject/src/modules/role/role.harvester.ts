import { findTarget } from "../findTarget";
import { actionHarvest } from "../action.harvest";
import { memoryManager } from "../memoryManager";
import { CreepMemory } from "../../main";

export const roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep: Creep) {
    if (
      (creep.memory as CreepMemory).refueling &&
      creep.store[RESOURCE_ENERGY] == 0
    ) {
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).refueling = false;
      const randTargetId = findTarget.randomSourcesFind(creep);
      (creep.memory as CreepMemory).harvestTargetId = randTargetId;
      creep.say("🔄 harvest");
    }

    if (
      !(creep.memory as CreepMemory).refueling &&
      creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0
    ) {
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).refueling = true;
      creep.say("⛽ refuel");
    }

    if ((creep.memory as CreepMemory).refueling) {
      const targets = findTarget.filling(creep);
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      }
    } else {
      actionHarvest.run(creep);
    }
  },
};
