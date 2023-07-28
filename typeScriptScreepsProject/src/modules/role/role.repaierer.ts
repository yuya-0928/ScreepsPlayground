import { memoryManager } from '../memoryManager';
import { CreepMemory } from '../../main';
import { isCreepStoreEmpty, isCreepStoreFull } from '../check/check.store';
import { withdrowEnegy } from '../action/withdrowEnegy';
import { actionRepair } from '../action/actionRepaier';
import { findLowestHitsTarget } from '../find/findLowestHitsTarget';

const isRepaiering = (creep: Creep) => {
  return (creep.memory as CreepMemory).repaiering;
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

        actionRepair(creep);
        break;

      case 'fillingEnegy':
        if (isCreepStoreFull(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).repaiering = 'repaiering';
          const lowestHitsTarget = findLowestHitsTarget(creep);
          (creep.memory as CreepMemory).repaierTargetId = lowestHitsTarget.id;
          creep.say('🔧 repaier');
          break;
        }

        // TODO: Creepの動作状態をMemoryに保存
        withdrowEnegy(creep);
        break;

      case undefined:
        // TODO: Creepが作りたての状態が決まったら削除する
        memoryManager.refreshMemory(creep);
        (creep.memory as CreepMemory).repaiering = 'fillingEnegy';
        creep.say('🔄 harvest');
        break;
    }
  },
};
