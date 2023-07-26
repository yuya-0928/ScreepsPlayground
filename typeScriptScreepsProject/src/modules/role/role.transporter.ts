import { CreepMemory } from "../../main";
import { actionMove } from "../action/action.move";
import { withdrowEnegy } from "../action/withdrowEnegy";
import { isCreepStoreEmpty, isCreepStoreFull } from "../check/check.store";
import { findContainers } from "../find/findContainers";
import { findExtensions } from "../find/findExtensions";
import { findSpawners } from "../find/findSpawners";
import { findTarget } from "../findTarget";
import { memoryManager } from "../memoryManager";

const isTransporting = (creep: Creep) =>
  (creep.memory as CreepMemory).isTransporting;

const getCurrentContainerId = (creep: Creep) =>
  (creep.memory as CreepMemory).containerId;

const hasStore = (target: AnyStructure): target is StructureStorage => {
  return "store" in target;
};

export const roleTransporter = (creep: Creep) => {
  switch (isTransporting(creep)) {
    case "transporting":
      if (isCreepStoreEmpty(creep)) {
        memoryManager.refreshMemory(creep);
        const randTargetId = findTarget.randomSourcesFind(creep);
        (creep.memory as CreepMemory).isTransporting = "fillingEnegy";
        creep.say("🔄 fill enegy");
        break;
      }

      // TODO: 運び先がMaxだったら、コンテナに戻す
      const spawners = findSpawners(creep);
      const extensions = findExtensions(creep);
      const sorted_extensions = extensions
        .filter(hasStore)
        .sort(
          (a, b) =>
            a.store.getFreeCapacity(RESOURCE_ENERGY) -
            b.store.getFreeCapacity(RESOURCE_ENERGY)
        );
      const targets = spawners.concat(sorted_extensions);

      const filtered_targets = targets.filter(hasStore).filter((target) => {
        return target.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      });

      if (filtered_targets.length > 0) {
        if (
          creep.transfer(filtered_targets[0], RESOURCE_ENERGY) ==
          ERR_NOT_IN_RANGE
        ) {
          actionMove(creep, filtered_targets[0]);
        }
      }
      break;

    case "fillingEnegy":
      if (isCreepStoreFull(creep)) {
        memoryManager.refreshMemory(creep);
        (creep.memory as CreepMemory).isTransporting = "transporting";
        creep.say("⛽ transport");
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

      // コンテナからエナジーを取得する
      withdrowEnegy(creep);
      break;

    case undefined:
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).isTransporting = "fillingEnegy";
      creep.say("🔄 fill enegy");
      break;
  }
};
