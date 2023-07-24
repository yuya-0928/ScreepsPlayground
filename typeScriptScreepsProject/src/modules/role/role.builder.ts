import { findTarget } from "../findTarget";
import { actionHarvest } from "../action.harvest";
import { memoryManager } from "../memoryManager";
import { CreepMemory } from "../../main";

export const roleBuilder = {
  /** @param {Creep} creep **/
  run: function (creep: Creep) {
    if (
      (creep.memory as CreepMemory).building &&
      creep.store[RESOURCE_ENERGY] == 0
    ) {
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).building = false;
      const randTargetId = findTarget.randomSourcesFind(creep);
      (creep.memory as CreepMemory).harvestTargetId = randTargetId;
      (creep.memory as CreepMemory).roleAs = "builder";
      creep.say("🔄 harvest");
    }
    if (
      !(creep.memory as CreepMemory).building &&
      creep.store.getFreeCapacity() == 0
    ) {
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).building = true;
      (creep.memory as CreepMemory).roleAs = "builder";
      creep.say("🚧 build");
    }

    if ((creep.memory as CreepMemory).building) {
      let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          // TODO: Creepの動作状態をMemoryに保存
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
