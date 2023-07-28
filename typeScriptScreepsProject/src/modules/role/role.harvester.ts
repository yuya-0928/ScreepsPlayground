import { actionHarvest } from '../action/action.harvest';
import { memoryManager } from '../memoryManager';
import { CreepMemory } from '../../main';
import { isCreepStoreEmpty, isCreepStoreFull } from '../check/check.store';
import { roleUpgrader } from './role.upgrader';
import { actionRefuel } from '../action/actionRefuel';
import { findSpawners } from '../find/findSpawners';
import { findExtensions } from '../find/findExtensions';
import { findTowers } from '../find/findTowers';

const isHarvesting = (creep: Creep) => {
  return (creep.memory as CreepMemory).refueling;
};

const settingRole = (creep: Creep) => {
  const spawners = findSpawners(creep);
  const extensions = findExtensions(creep);
  const towers = findTowers(creep);
  const targets = spawners.concat(extensions, towers);
  if (targets.length === 0) {
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

        actionRefuel(creep);
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
