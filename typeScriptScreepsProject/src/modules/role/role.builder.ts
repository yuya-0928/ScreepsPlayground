import { findTarget } from "../findTarget";
import { actionHarvest } from "../action/action.harvest";
import { memoryManager } from "../memoryManager";
import { CreepMemory } from "../../main";
import { actionMove } from "../action/action.move";
import { isCreepStoreEmpty, isCreepStoreFull } from "../check/check.store";
import { findContainers } from "../find/findContainers";
import { withdrowEnegy } from "../action/withdrowEnegy";

const isBuilding = (creep: Creep) => {
  return (creep.memory as CreepMemory).building;
};

const getCurrentContainerId = (creep: Creep) =>
  (creep.memory as CreepMemory).containerId;

export const roleBuilder = {
  run: (creep: Creep) => {
    (creep.memory as CreepMemory).roleAs = "builder";

    // TODO: Creepが作りたての状態を考慮できていないため、roleのみが設定された状態のCreepの扱いを決める
    switch (isBuilding(creep)) {
      // TODO: true, falseから具体的な状態名にする
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

        let target: AnyStructure | null = null;
        if (getCurrentContainerId(creep)) {
          target = Game.getObjectById(
            getCurrentContainerId(creep)
          ) as AnyStructure;
        } else {
          const targets = findContainers(creep);
          if (targets.length > 0) {
            (creep.memory as CreepMemory).withdrowTargetId = targets[0].id;
            target = targets[0];
          } else {
            // TODO: エナジーが入ったコンテナがない場合の処理を書く
            break;
          }
        }

        withdrowEnegy(creep);
        break;

      case undefined:
        // TODO: Creepが作りたての状態が決まったら削除する
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          const randTargetId = findTarget.randomSourcesFind(creep);
          (creep.memory as CreepMemory).building = false;
          (creep.memory as CreepMemory).harvestTargetId = randTargetId;
          creep.say("🔄 harvest");
          break;
        }
        break;
    }
  },
};
