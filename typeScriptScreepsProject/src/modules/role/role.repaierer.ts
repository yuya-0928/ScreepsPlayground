import { findTarget } from "../findTarget";
import { actionHarvest } from "../action/action.harvest";
import { memoryManager } from "../memoryManager";
import { CreepMemory } from "../../main";
import { isCreepStoreEmpty, isCreepStoreFull } from "../check/check.store";

const isRepaiering = (creep: Creep) => {
  return (creep.memory as CreepMemory).repaiering;
};

export const roleRepaierer = {
  run: function (creep: Creep) {
    (creep.memory as CreepMemory).roleAs = "repaierer";

    if (isRepaiering(creep) && isCreepStoreEmpty(creep)) {
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).repaiering = false;
      const randTargetId = findTarget.randomSourcesFind(creep);
      (creep.memory as CreepMemory).harvestTargetId = randTargetId;
      creep.say("🔄 harvest");
    }

    if (!isRepaiering(creep) && isCreepStoreFull(creep)) {
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).repaiering = true;
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (object) => object.hits < object.hitsMax,
      });
      targets.sort((a, b) => a.hits - b.hits);
      const targetId = targets[0].id;
      (creep.memory as CreepMemory).repaierTargetId = targetId;
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
