import { roleBuilder } from './modules/role/role.builder';
import { managementCreepCount } from './managementCreep';
import { spawnUpgrader } from './modules/spawn/spawn.upgrader';
import { logger } from './modules/logger';
import { spawnRepaierer } from './modules/spawn/spawn.repaierer';
import { deleteDeadCreepMemory } from './modules/deleteDeadCreepMemory';
import { roleHarvester } from './modules/role/role.harvester';
import { spawnHarvester } from './modules/spawn/spawn.harvester';
import { spawnBuilder } from './modules/spawn/spawn.builder';
import { roleUpgrader } from './modules/role/role.upgrader';
import { roleRepaierer } from './modules/role/role.repaierer';
import { findCreepsByRole } from './modules/find/findCreepsByRole';
import { spawnTransporter } from './modules/spawn/spawn.transporter';
import { roleTransporter } from './modules/role/role.transporter';
import { spawnerStatus } from './modules/spawnerStatus';
import { roleHealer } from './modules/role/roleHealer';
import { roleAttacker } from './modules/role/roleAttacker';

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
  // TODO: Creep生成の優先順位を決定するコードを書く
  // TODO: spawnManager.tsを作成し、Creep生成のコードを移動する。
  const harvesters = findCreepsByRole('harvester');
  if (harvesters.length < managementCreepCount.harvester) {
    spawnHarvester.run(Game.spawns['Spawn1']);
  }

  const transporters = findCreepsByRole('transporter');
  if (
    harvesters.length == managementCreepCount.harvester &&
    transporters.length < managementCreepCount.transporter
  ) {
    spawnTransporter.run(Game.spawns['Spawn1']);
  }

  const upgraders = findCreepsByRole('upgrader');
  if (
    harvesters.length == managementCreepCount.harvester &&
    transporters.length == managementCreepCount.transporter &&
    upgraders.length < managementCreepCount.upgrader
  ) {
    spawnUpgrader.run(Game.spawns['Spawn1']);
  }

  const builders = findCreepsByRole('builder');
  if (
    harvesters.length == managementCreepCount.harvester &&
    transporters.length == managementCreepCount.transporter &&
    upgraders.length == managementCreepCount.upgrader &&
    builders.length < managementCreepCount.builder
  ) {
    spawnBuilder.run(Game.spawns['Spawn1']);
  }

  const repaierers = findCreepsByRole('repaierer');
  if (
    harvesters.length == managementCreepCount.harvester &&
    transporters.length == managementCreepCount.transporter &&
    upgraders.length == managementCreepCount.upgrader &&
    builders.length == managementCreepCount.builder &&
    repaierers.length < managementCreepCount.repaierer
  ) {
    spawnRepaierer.run(Game.spawns['Spawn1']);
  }

  spawnerStatus.show(Game.spawns['Spawn1']);

  // TODO: spawnManager.tsを作成し、Creep生成のコードを移動する。
  for (let name in Game.creeps) {
    const creep = Game.creeps[name];
    switch ((creep.memory as CreepMemory).role) {
      case 'harvester': {
        roleHarvester.run(creep);
        break;
      }

      case 'transporter': {
        roleTransporter(creep);
        break;
      }

      case 'upgrader': {
        roleUpgrader.run(creep);
        break;
      }

      case 'builder': {
        roleBuilder.run(creep);
        break;
      }

      case 'repaierer': {
        roleRepaierer.run(creep);
        break;
      }

      case 'attacker': {
        roleAttacker(creep);
        break;
      }

      case 'healer': {
        roleHealer(creep);
        break;
      }
    }
  }

  logger.creepCountInfo(
    harvesters,
    transporters,
    upgraders,
    builders,
    repaierers
  );
  logger.creepCosts();
  logger.sourceCountBuildingCreep();
};
