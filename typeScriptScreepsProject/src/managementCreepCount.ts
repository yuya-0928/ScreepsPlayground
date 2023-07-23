export const managementCreepCount = {
  harvester: 2,
  upgrader: 2,
  builder: 0,
  repaierer: 0,
};

export const creepStatus = {
  harvester: [WORK, CARRY, MOVE, MOVE],
  upgrader: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
  builder: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
  repaierer: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
};
