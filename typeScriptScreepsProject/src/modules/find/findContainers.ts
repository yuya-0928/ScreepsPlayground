export const findContainers = (creep: Creep) => {
  const containers = creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (
        structure.structureType == STRUCTURE_CONTAINER &&
        structure.store[RESOURCE_ENERGY] > 0
      );
    },
  });
  return containers;
};
