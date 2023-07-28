export const findLowestHitsTarget = (creep: Creep) => {
  const targets = creep.room.find(FIND_STRUCTURES, {
    filter: (object) => object.hits < object.hitsMax,
  });
  targets.sort((a, b) => a.hits - b.hits);
  return targets[0];
};
