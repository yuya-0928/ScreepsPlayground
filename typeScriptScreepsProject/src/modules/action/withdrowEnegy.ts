import { findContainers } from '../find/findContainers';
import { CreepMemory } from '../../main';
import { actionTransfer } from './actionTransfer';

const getCurrentContainerId = (creep: Creep) =>
  (creep.memory as CreepMemory).containerId;

export const withdrowEnegy = (creep: Creep) => {
  if (!getCurrentContainerId(creep)) {
    const targets = findContainers(creep);
    if (targets.length > 0) {
      (creep.memory as CreepMemory).withdrowTargetId = targets[0].id;
    } else {
      console.log('No containers found');
    }
  }

  if (findContainers(creep) === undefined || 0) {
    actionTransfer(creep);
    return;
  }

  if ((creep.memory as CreepMemory).withdrowTargetId) {
    const sources: AnyStructure[] = [];
    sources.push(
      Game.getObjectById(
        (creep.memory as CreepMemory).withdrowTargetId
      ) as AnyStructure
    );
    switch (creep.withdraw(sources[0], RESOURCE_ENERGY)) {
      case ERR_NOT_IN_RANGE: {
        creep.moveTo(sources[0], {
          visualizePathStyle: { stroke: '#ffaa00' },
        });
        break;
      }

      case ERR_NOT_ENOUGH_RESOURCES || ERR_INVALID_TARGET: {
        const targets = findContainers(creep);
        if (targets.length > 0) {
          (creep.memory as CreepMemory).withdrowTargetId = targets[0].id;
        }
        break;
      }

      default: {
        creep.withdraw(sources[0], RESOURCE_ENERGY);
        break;
      }
    }
  }
};
