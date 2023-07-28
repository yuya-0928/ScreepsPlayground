export const attackTarget = (creep: Creep) => {
  return creep.room.find(FIND_HOSTILE_CREEPS);
};
