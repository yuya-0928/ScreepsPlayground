import { findTarget } from '../findTarget';
import { actionMove } from './action.move';

export const actionRefuel = (creep: Creep) => {
  // TODO: Mapにコンテナが存在しなかったら、SpawnerやExtensionに運ぶ

  // TODO: fillingを使わずに、findContainersを使う
  const targets = findTarget.filling(creep);
  const closestTarget = creep.pos.findClosestByPath(targets);
  if (closestTarget) {
    // TODO: Creepの動作状態をMemoryに保存
    if (creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      actionMove(creep, closestTarget);
    }
  }
};
