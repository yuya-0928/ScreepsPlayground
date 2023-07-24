import { findTarget } from "../findTarget";
import { actionHarvest } from "../action/action.harvest";
import { memoryManager } from "../memoryManager";
import { CreepMemory } from "../../main";

export const roleRepaierer = {
  /** @param {Creep} creep **/
  run: function (creep: Creep) {
    if (
      (creep.memory as CreepMemory).repaiering &&
      creep.store[RESOURCE_ENERGY] == 0
    ) {
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).repaiering = false;
      const randTargetId = findTarget.randomSourcesFind(creep);
      (creep.memory as CreepMemory).harvestTargetId = randTargetId;
      (creep.memory as CreepMemory).roleAs = "repaierer";
      creep.say("🔄 harvest");
    }

    if (
      !(creep.memory as CreepMemory).repaiering &&
      creep.store.getFreeCapacity() == 0
    ) {
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).repaiering = true;
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (object) => object.hits < object.hitsMax,
      });
      targets.sort((a, b) => a.hits - b.hits);
      const targetId = targets[0].id;
      (creep.memory as CreepMemory).repaierTargetId = targetId;
      (creep.memory as CreepMemory).roleAs = "repaierer";
      creep.say("🔧 repaier");
    }

    if ((creep.memory as CreepMemory).repaiering) {
      if ((creep.memory as CreepMemory).repaierTargetId) {
        const targets: Structure<StructureConstant>[] = [];
        targets.push(
          Game.getObjectById(
            (creep.memory as CreepMemory).repaierTargetId
          ) as Structure<StructureConstant>
        );
        if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          // TODO: Creepの動作状態をMemoryに保存
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
        if (targets[0].hits == targets[0].hitsMax) {
          const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (object) => object.hits < object.hitsMax,
          });
          targets.sort((a, b) => a.hits - b.hits);
          (creep.memory as CreepMemory).repaierTargetId = targets[0].id;
        }
      } else {
        const targets = creep.room.find(FIND_STRUCTURES, {
          filter: (object) => object.hits < object.hitsMax,
        });
        targets.sort((a, b) => a.hits - b.hits);
        if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
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
