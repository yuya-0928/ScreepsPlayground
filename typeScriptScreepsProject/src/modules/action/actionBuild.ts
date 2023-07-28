import { actionMove } from './action.move';

export const actionBuild = (creep: Creep) => {
  let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
  if (targets.length) {
    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
      // TODO: Creepの動作状態をMemoryに保存
      actionMove(creep, targets[0]);
    }
  }
};
