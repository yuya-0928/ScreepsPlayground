import { actionMove } from '../action/action.move';

export const roleAttacker = (creep: Creep) => {
  const targets = creep.room.find(FIND_HOSTILE_CREEPS);
  if (targets.length) {
    if (creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
      actionMove(creep, targets[0]);
    }
  }
};
