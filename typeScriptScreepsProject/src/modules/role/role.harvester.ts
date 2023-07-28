import { findTarget } from '../findTarget';
import { actionHarvest } from '../action/action.harvest';
import { memoryManager } from '../memoryManager';
import { CreepMemory } from '../../main';
import { isCreepStoreEmpty, isCreepStoreFull } from '../check/check.store';
import { actionMove } from '../action/action.move';
import { roleUpgrader } from './role.upgrader';

const isHarvesting = (creep: Creep) => {
  return (creep.memory as CreepMemory).refueling;
};

const settingRole = (creep: Creep) => {
  const harvestingTargets = findTarget.filling(creep);
  if (harvestingTargets.length === 0) {
    roleUpgrader.run(creep);
  } else {
    return;
  }
};

// TODO: harvesterがharvestする場所を固定にする
// TODO: harvestTargetIdをMemoryに保存する処理をaction.harvest.tsに移動する
export const roleHarvester = {
  run: function (creep: Creep) {
    settingRole(creep);

    (creep.memory as CreepMemory).roleAs = 'harvester';

    // TODO: Creepが作りたての状態を考慮できていないため、roleのみが設定された状態のCreepの扱いを決める
    switch (isHarvesting(creep)) {
      // TODO: true, falseから具体的な状態名にする
      case true:
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).refueling = false;
          creep.say('🔄 harvest');
          break;
        }

        // TODO: Mapにコンテナが存在しなかったら、SpawnerやExtensionに運ぶ

        // TODO: fillingを使わずに、findContainersを使う
        const targets = findTarget.filling(creep);
        const closestTarget = creep.pos.findClosestByPath(targets);
        if (closestTarget) {
          // TODO: Creepの動作状態をMemoryに保存
          if (
            creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
          ) {
            actionMove(creep, closestTarget);
          }
        }
        break;

      case false:
        if (isCreepStoreFull(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).refueling = true;
          creep.say('⛽ refuel');
          break;
        }

        // TODO: Creepの動作状態をMemoryに保存
        actionHarvest.run(creep);
        break;

      case undefined:
        // TODO: Creepが作りたての状態が決まったら削除する
        memoryManager.refreshMemory(creep);
        (creep.memory as CreepMemory).refueling = false;
        creep.say('🔄 harvest');
        break;
    }
  },
};
