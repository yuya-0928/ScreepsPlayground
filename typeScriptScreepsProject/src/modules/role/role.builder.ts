import { findTarget } from '../findTarget';
import { memoryManager } from '../memoryManager';
import { CreepMemory } from '../../main';
import { actionMove } from '../action/action.move';
import { isCreepStoreEmpty, isCreepStoreFull } from '../check/check.store';
import { withdrowEnegy } from '../action/withdrowEnegy';
import { findCreepsByRole } from '../find/findCreepsByRole';
import { minimumHarvesterCount } from '../../managementCreep';
import { roleHarvester } from './role.harvester';
import { roleRepaierer } from './role.repaierer';
import { roleUpgrader } from './role.upgrader';

const isBuilding = (creep: Creep) => {
  return (creep.memory as CreepMemory).building;
};

const settingRole = (creep: Creep) => {
  const buildingTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
  const repaierTargets = creep.room.find(FIND_STRUCTURES, {
    filter: (object) => object.hits < object.hitsMax,
  });
  if (findCreepsByRole('harvesters').length < minimumHarvesterCount) {
    roleHarvester.run(creep);
  } else if (buildingTargets.length > 0) {
    return;
  } else if (repaierTargets.length > 0) {
    roleRepaierer.run(creep);
  } else {
    roleUpgrader.run(creep);
  }
};

export const roleBuilder = {
  run: (creep: Creep) => {
    settingRole(creep);

    (creep.memory as CreepMemory).roleAs = 'builder';

    // TODO: Creepが作りたての状態を考慮できていないため、roleのみが設定された状態のCreepの扱いを決める
    switch (isBuilding(creep)) {
      // TODO: true, falseから具体的な状態名にする
      case true:
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).building = false;
          creep.say('🔄 harvest');
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
          creep.say('🚧 build');
          break;
        }

        withdrowEnegy(creep);
        break;

      case undefined:
        // TODO: Creepが作りたての状態が決まったら削除する
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).building = false;
          creep.say('🔄 harvest');
          break;
        }
        break;
    }
  },
};
