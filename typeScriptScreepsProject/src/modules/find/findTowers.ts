export const findSpawners = (creep: Creep) => {
  return creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_TOWER;
    },
  });
};
