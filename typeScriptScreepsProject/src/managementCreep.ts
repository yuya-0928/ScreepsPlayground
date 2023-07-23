import { creepCosts } from "./creepCosts";

export const managementCreepCount = {
  harvester: 2,
  upgrader: 2,
  builder: 2,
  repaierer: 0,
};

export const creepStatus = {
  harvester: [WORK, CARRY, MOVE, MOVE],
  upgrader: [WORK, CARRY, MOVE, MOVE],
  builder: [WORK, CARRY, MOVE, MOVE],
  repaierer: [WORK, CARRY, MOVE, MOVE],
};

export const caluclateCreepCost = (creepStatus: BodyPartConstant[]): number => {
  let cost = 0;
  for (const bodyPart of creepStatus) {
    cost += creepCosts[bodyPart];
  }
  return cost;
};
