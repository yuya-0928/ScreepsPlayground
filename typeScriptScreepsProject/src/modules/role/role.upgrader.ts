import { findTarget } from "../findTarget";
import { actionHarvest } from "../action/action.harvest";
import { memoryManager } from "../memoryManager";
import { CreepMemory } from "../../main";

export const roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep: Creep) {
    if (
      (creep.memory as CreepMemory).upgrading &&
      creep.store[RESOURCE_ENERGY] == 0
    ) {
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).upgrading = false;
      const randTargetId = findTarget.randomSourcesFind(creep);
      (creep.memory as CreepMemory).harvestTargetId = randTargetId;
      (creep.memory as CreepMemory).roleAs = "upgrader";
      creep.say("🔄 harvest");
    }
    if (
      !(creep.memory as CreepMemory).upgrading &&
      creep.store.getFreeCapacity() == 0
    ) {
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).upgrading = true;
      (creep.memory as CreepMemory).roleAs = "upgrader";
      creep.say("⚡ upgrade");
    }

    if ((creep.memory as CreepMemory).upgrading) {
      if (
        creep.room.controller &&
        creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
      ) {
        // TODO: Creepの動作状態をMemoryに保存
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
    } else {
      // TODO: Creepの動作状態をMemoryに保存
      actionHarvest.run(creep);
    }
  },
};
