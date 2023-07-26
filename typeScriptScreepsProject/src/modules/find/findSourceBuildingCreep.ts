export const findSourceBuildingCreep = () => {
  const sources = Game.spawns["Spawn1"].room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (
        structure.structureType == STRUCTURE_EXTENSION ||
        structure.structureType == STRUCTURE_SPAWN
      );
    },
  });
  let sourceStorage = 0;
  sources.forEach((source) => {
    switch (source.structureType) {
      case STRUCTURE_EXTENSION:
        sourceStorage += source.store.getCapacity(RESOURCE_ENERGY);
        break;
      case STRUCTURE_SPAWN:
        sourceStorage += source.store.getCapacity(RESOURCE_ENERGY);
        break;
    }
  });
  return sourceStorage;
};
