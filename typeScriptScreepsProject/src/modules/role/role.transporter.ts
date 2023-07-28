import { CreepMemory } from '../../main';
import { actionTransport } from '../action/actionTransport';
import { withdrowEnegy } from '../action/withdrowEnegy';
import { isCreepStoreEmpty, isCreepStoreFull } from '../check/check.store';
import { memoryManager } from '../memoryManager';

const isTransporting = (creep: Creep) =>
  (creep.memory as CreepMemory).isTransporting;

export const roleTransporter = (creep: Creep) => {
  switch (isTransporting(creep)) {
    case 'transporting':
      if (isCreepStoreEmpty(creep)) {
        memoryManager.refreshMemory(creep);
        (creep.memory as CreepMemory).isTransporting = 'fillingEnegy';
        creep.say('🔄 fill enegy');
        break;
      }

      actionTransport(creep);
      break;

    case 'fillingEnegy':
      if (isCreepStoreFull(creep)) {
        memoryManager.refreshMemory(creep);
        (creep.memory as CreepMemory).isTransporting = 'transporting';
        creep.say('⛽ transport');
        break;
      }

      // コンテナからエナジーを取得する
      withdrowEnegy(creep);
      break;

    case undefined:
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).isTransporting = 'fillingEnegy';
      creep.say('🔄 fill enegy');
      break;
  }
};
