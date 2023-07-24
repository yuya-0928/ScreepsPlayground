export const isCreepStoreEmpty = (creep: Creep) => {
  return creep.store[RESOURCE_ENERGY] == 0;
};

export const isCreepStoreFull = (creep: Creep) => {
  return creep.store.getFreeCapacity() == 0;
};
