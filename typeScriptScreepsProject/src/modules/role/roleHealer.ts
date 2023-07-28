import { actionMove } from '../action/action.move';

export const roleHealer = (creep: Creep) => {
  // TODO: SourceのIDを指定して、同時採掘可能な分のCreep数だけ割り当てる
  // TODO: Mapから、Sourceを取得し、同時採掘可能なCreep数を割り出す
  const targets = creep.room.find(FIND_HOSTILE_CREEPS);
  if (targets.length) {
    if (creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
      actionMove(creep, targets[0]);
    }
  }
};
