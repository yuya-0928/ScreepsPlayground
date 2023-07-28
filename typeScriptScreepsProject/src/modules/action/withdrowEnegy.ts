import { findContainers } from '../find/findContainers';
import { CreepMemory } from '../../main';

const getCurrentContainerId = (creep: Creep) =>
  (creep.memory as CreepMemory).containerId;

export const withdrowEnegy = (creep: Creep) => {
  let target: AnyStructure | null = null;
  if (getCurrentContainerId(creep)) {
    target = Game.getObjectById(getCurrentContainerId(creep)) as AnyStructure;
  } else {
    const targets = findContainers(creep);
    if (targets.length > 0) {
      (creep.memory as CreepMemory).withdrowTargetId = targets[0].id;
      target = targets[0];
    } else {
      // TODO: エナジーが入ったコンテナがない場合の処理を書く
    }
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
