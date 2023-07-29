import { findContainers } from '../find/findContainers';
import { actionMove } from './action.move';
import { actionTransport } from './actionTransport';

export const actionRefuel = (creep: Creep) => {
  // TODO: Mapにコンテナが存在しなかったら、SpawnerやExtensionに運ぶ

  const extensions = findContainers(creep);

  switch (extensions.length === 0) {
    case true:
      actionTransport(creep);
      break;
    case false:
      const closestTarget = creep.pos.findClosestByPath(extensions);
      if (closestTarget) {
        // TODO: Creepの動作状態をMemoryに保存
        if (
          creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          actionMove(creep, closestTarget);
        }
      }
      break;
  }
};
