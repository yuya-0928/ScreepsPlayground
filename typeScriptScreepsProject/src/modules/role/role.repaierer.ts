import { findTarget } from "../findTarget";
import { actionHarvest } from "../action/action.harvest";
import { memoryManager } from "../memoryManager";
import { CreepMemory } from "../../main";
import { isCreepStoreEmpty, isCreepStoreFull } from "../check/check.store";
import { actionMove } from "../action/action.move";

const isRepaiering = (creep: Creep) => {
  return (creep.memory as CreepMemory).repaiering;
};

const isRepaierTargetIdExistInMemory = (creep: Creep) => {
  return (creep.memory as CreepMemory).repaierTargetId !== undefined;
};

const findLowestHitsTarget = (creep: Creep) => {
  const targets = creep.room.find(FIND_STRUCTURES, {
    filter: (object) => object.hits < object.hitsMax,
  });
  targets.sort((a, b) => a.hits - b.hits);
  return targets[0];
};

export const roleRepaierer = {
  run: function (creep: Creep) {
    (creep.memory as CreepMemory).roleAs = "repaierer";
    // TODO: Creepが作りたての状態を考慮できていないため、roleのみが設定された状態のCreepの扱いを決める
    switch (isRepaiering(creep)) {
      case true:
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).repaiering = false;
          const randTargetId = findTarget.randomSourcesFind(creep);
          (creep.memory as CreepMemory).harvestTargetId = randTargetId;
          creep.say("🔄 harvest");
          break;
        }

        switch (isRepaierTargetIdExistInMemory(creep)) {
          case true:
            const targetInMemory = Game.getObjectById(
              (creep.memory as CreepMemory).repaierTargetId
            ) as Structure<StructureConstant>;

            if (targetInMemory.hits == targetInMemory.hitsMax) {
              const lowestHitsTarget = findLowestHitsTarget(creep);
              (creep.memory as CreepMemory).repaierTargetId =
                lowestHitsTarget.id;
              break;
            }

            if (creep.repair(targetInMemory) === ERR_NOT_IN_RANGE) {
              // TODO: Creepの動作状態をMemoryに保存
              actionMove(creep, targetInMemory);
              break;
            }

            creep.repair(targetInMemory);
            break;

          case false:
            const lowestHitsTarget = findLowestHitsTarget(creep);
            (creep.memory as CreepMemory).repaierTargetId = lowestHitsTarget.id;
            break;
        }

      case false:
        // TODO: Creepが作りたての状態が決まったら削除する
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).repaiering = false;
          const randTargetId = findTarget.randomSourcesFind(creep);
          (creep.memory as CreepMemory).harvestTargetId = randTargetId;
          creep.say("🔄 harvest");
          break;
        }

        if (isCreepStoreFull(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).repaiering = true;
          const lowestHitsTarget = findLowestHitsTarget(creep);
          (creep.memory as CreepMemory).repaierTargetId = lowestHitsTarget.id;
          creep.say("🔧 repaier");
        }

        // TODO: Creepの動作状態をMemoryに保存
        actionHarvest.run(creep);
    }
  },
};
