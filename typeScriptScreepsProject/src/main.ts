import { logger } from './modules/logger';
import { deleteDeadCreepMemory } from './modules/deleteDeadCreepMemory';
import { roleManager } from './modules/role/roleManager';
import { spawnManager } from './modules/spawn/spawnManager';

export interface CreepMemory {
  [key: string]: any;
  role: string;
  refueling: boolean;
  upgrading?: boolean;
  building?: boolean;
  repaiering?: string;
  repaierTargetId: string;
}

deleteDeadCreepMemory();

module.exports.loop = function () {
  spawnManager();
  roleManager();

  logger.creepCosts();
  logger.sourceCountBuildingCreep();
};
