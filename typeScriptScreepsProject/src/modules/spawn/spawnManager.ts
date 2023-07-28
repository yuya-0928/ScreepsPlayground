import { managementCreepCount } from '../../managementCreep';
import { findCreepsByRole } from '../find/findCreepsByRole';
import { logger } from '../logger';
import { spawnerStatus } from '../spawnerStatus';
import { spawnBuilder } from './spawn.builder';
import { spawnHarvester } from './spawn.harvester';
import { spawnRepaierer } from './spawn.repaierer';
import { spawnTransporter } from './spawn.transporter';
import { spawnUpgrader } from './spawn.upgrader';

// TODO: Creep生成の優先順位を決定するコードを書く
export const spawnManager = () => {
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
  logger.creepCountInfo(
    harvesters,
    transporters,
    upgraders,
    builders,
    repaierers
  );
};
