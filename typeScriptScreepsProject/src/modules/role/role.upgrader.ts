import { findTarget } from "../findTarget";
import { actionHarvest } from "../action/action.harvest";
import { memoryManager } from "../memoryManager";
import { CreepMemory } from "../../main";
import { isCreepStoreEmpty, isCreepStoreFull } from "../check/check.store";
import { actionMove } from "../action/action.move";
import { findContainers } from "../find/findContainers";
import { withdrowEnegy } from "../action/withdrowEnegy";

const isUpgrading = (creep: Creep) => {
  return (creep.memory as CreepMemory).upgrading;
};

const getCurrentContainerId = (creep: Creep) =>
  (creep.memory as CreepMemory).containerId;

export const roleUpgrader = {
  run: function (creep: Creep) {
    // TODO: Creepが作りたての状態を考慮できていないため、roleのみが設定された状態のCreepの扱いを決める
    switch (isUpgrading(creep)) {
      // TODO: true, falseから具体的な状態名にする
      case true:
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).upgrading = false;
          const randTargetId = findTarget.randomSourcesFind(creep);
          (creep.memory as CreepMemory).harvestTargetId = randTargetId;
          (creep.memory as CreepMemory).roleAs = "upgrader";
          creep.say("🔄 harvest");
        }

        if (creep.room.controller) {
          if (
            creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
          ) {
            // TODO: Creepの動作状態をMemoryに保存
            actionMove(creep, creep.room.controller);
            break;
          }

          creep.upgradeController(creep.room.controller);
          break;
        }
        break;

      case false:
        if (isCreepStoreFull(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).upgrading = true;
          (creep.memory as CreepMemory).roleAs = "upgrader";
          creep.say("⚡ upgrade");
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

        // コンテナからエナジーを取得する
        withdrowEnegy(creep);
        break;

      case undefined:
        // TODO: Creepが作りたての状態が決まったら削除する
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).upgrading = false;
          const randTargetId = findTarget.randomSourcesFind(creep);
          (creep.memory as CreepMemory).harvestTargetId = randTargetId;
          (creep.memory as CreepMemory).roleAs = "upgrader";
          creep.say("🔄 harvest");
        }
        break;
    }
  },
};
