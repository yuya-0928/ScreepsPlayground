import { memoryManager } from '../memoryManager';
import { CreepMemory } from '../../main';
import { isCreepStoreEmpty, isCreepStoreFull } from '../check/check.store';
import { actionMove } from '../action/action.move';
import { findContainers } from '../find/findContainers';
import { withdrowEnegy } from '../action/withdrowEnegy';

const isRepaiering = (creep: Creep) => {
  return (creep.memory as CreepMemory).repaiering;
};

const isRepaierTargetIdExistInMemory = (creep: Creep) => {
  return (creep.memory as CreepMemory).repaierTargetId !== undefined;
};

const getCurrentContainerId = (creep: Creep) =>
  (creep.memory as CreepMemory).containerId;

const findLowestHitsTarget = (creep: Creep) => {
  const targets = creep.room.find(FIND_STRUCTURES, {
    filter: (object) => object.hits < object.hitsMax,
  });
  targets.sort((a, b) => a.hits - b.hits);
  return targets[0];
};

export const roleRepaierer = {
  run: function (creep: Creep) {
    (creep.memory as CreepMemory).roleAs = 'repaierer';
    // TODO: Creepが作りたての状態を考慮できていないため、roleのみが設定された状態のCreepの扱いを決める
    switch (isRepaiering(creep)) {
      // TODO: true, falseから具体的な状態名にする
      case 'repaiering':
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).repaiering = 'fillingEnegy';
          creep.say('🔄 harvest');
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

      case 'fillingEnegy':
        if (isCreepStoreFull(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).repaiering = 'repaiering';
          const lowestHitsTarget = findLowestHitsTarget(creep);
          (creep.memory as CreepMemory).repaierTargetId = lowestHitsTarget.id;
          creep.say('🔧 repaier');
        }

        // TODO: Creepの動作状態をMemoryに保存
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
        memoryManager.refreshMemory(creep);
        (creep.memory as CreepMemory).repaiering = 'fillingEnegy';
        (creep.memory as CreepMemory).roleAs = 'repaierer';
        creep.say('🔄 harvest');
        break;
    }
  },
};
