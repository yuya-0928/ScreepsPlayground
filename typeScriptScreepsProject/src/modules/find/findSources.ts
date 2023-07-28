export const findSources = (creep: Creep) => {
  return creep.room.find(FIND_SOURCES_ACTIVE, {
    filter: (source) => {
      return source.energy > 0;
    },
  });
};
