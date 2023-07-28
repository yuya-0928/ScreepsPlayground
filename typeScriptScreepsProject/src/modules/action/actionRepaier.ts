import { findLowestHitsTarget } from '../find/findLowestHitsTarget';
import { CreepMemory } from '../../main';
import { actionMove } from './action.move';

export const actionRepair = (creep: Creep) => {
  if ((creep.memory as CreepMemory).repaierTargetId === undefined) {
    const lowestHitsTarget = findLowestHitsTarget(creep);
    (creep.memory as CreepMemory).repaierTargetId = lowestHitsTarget.id;
  }

  const targetInMemory = Game.getObjectById(
    (creep.memory as CreepMemory).repaierTargetId
  ) as Structure<StructureConstant>;

  if (targetInMemory.hits == targetInMemory.hitsMax) {
    const lowestHitsTarget = findLowestHitsTarget(creep);
    (creep.memory as CreepMemory).repaierTargetId = lowestHitsTarget.id;
  }

  if (creep.repair(targetInMemory) === ERR_NOT_IN_RANGE) {
    // TODO: Creepの動作状態をMemoryに保存
    actionMove(creep, targetInMemory);
  }

  creep.repair(targetInMemory);
};
