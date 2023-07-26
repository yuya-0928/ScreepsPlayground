import { roleBuilder } from "./modules/role/role.builder";
import { managementCreepCount, minimumHarvesterCount } from "./managementCreep";
import { spawnUpgrader } from "./modules/spawn/spawn.upgrader";
import { logger } from "./modules/logger";
import { findTarget } from "./modules/findTarget";
import { spawnRepaierer } from "./modules/spawn/spawn.repaierer";
import { deleteDeadCreepMemory } from "./modules/deleteDeadCreepMemory";
import { roleHarvester } from "./modules/role/role.harvester";
import { spawnHarvester } from "./modules/spawn/spawn.harvester";
import { spawnBuilder } from "./modules/spawn/spawn.builder";
import { roleUpgrader } from "./modules/role/role.upgrader";
import { roleRepaierer } from "./modules/role/role.repaierer";
import { findCreepsByRole } from "./modules/find/findCreepsByRole";
import { spawnTransporter } from "./modules/spawn/spawn.transporter";
import { roleTransporter } from "./modules/role/role.transporter";
import { spawnerStatus } from "./modules/spawnerStatus";

export interface CreepMemory {
  [key: string]: any;
  role: string;
  refueling: boolean;
  harvestTargetId: string;
  upgrading?: boolean;
  building?: boolean;
  repaiering?: boolean;
  repaierTargetId: string;
}

deleteDeadCreepMemory();

module.exports.loop = function () {
  // TODO: Creep生成の優先順位を決定するコードを書く
  // TODO: spawnManager.tsを作成し、Creep生成のコードを移動する。
  const harvesters = findCreepsByRole("harvester");
  if (harvesters.length < managementCreepCount.harvester) {
    spawnHarvester.run(Game.spawns["Spawn1"]);
  }

  const transporters = findCreepsByRole("transporter");
  if (
    harvesters.length == managementCreepCount.harvester &&
    transporters.length < managementCreepCount.transporter
  ) {
    spawnTransporter.run(Game.spawns["Spawn1"]);
  }

  const upgraders = findCreepsByRole("upgrader");
  if (
    harvesters.length == managementCreepCount.harvester &&
    transporters.length == managementCreepCount.transporter &&
    upgraders.length < managementCreepCount.upgrader
  ) {
    spawnUpgrader.run(Game.spawns["Spawn1"]);
  }

  const builders = findCreepsByRole("builder");
  if (
    harvesters.length == managementCreepCount.harvester &&
    transporters.length == managementCreepCount.transporter &&
    upgraders.length == managementCreepCount.upgrader &&
    builders.length < managementCreepCount.builder
  ) {
    spawnBuilder.run(Game.spawns["Spawn1"]);
  }

  const repaierers = findCreepsByRole("repaierer");
  if (
    harvesters.length == managementCreepCount.harvester &&
    transporters.length == managementCreepCount.transporter &&
    upgraders.length == managementCreepCount.upgrader &&
    builders.length == managementCreepCount.builder &&
    repaierers.length < managementCreepCount.repaierer
  ) {
    spawnRepaierer.run(Game.spawns["Spawn1"]);
  }

  spawnerStatus.show(Game.spawns["Spawn1"]);

  // TODO: spawnManager.tsを作成し、Creep生成のコードを移動する。
  for (let name in Game.creeps) {
    const creep = Game.creeps[name];
    switch ((creep.memory as CreepMemory).role) {
      case "harvester": {
        const harvestingTargets = findTarget.filling(creep);
        if (harvestingTargets.length === 0) {
          roleUpgrader.run(creep);
        } else {
          roleHarvester.run(creep);
        }
        break;
      }

      case "transporter": {
        roleTransporter(creep);
        break;
      }

      case "upgrader": {
        roleUpgrader.run(creep);
        break;
      }

      case "builder": {
        const buildingTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
        const repaierTargets = creep.room.find(FIND_STRUCTURES, {
          filter: (object) => object.hits < object.hitsMax,
        });
        if (harvesters.length < minimumHarvesterCount) {
          roleHarvester.run(creep);
        } else if (buildingTargets.length > 0) {
          roleBuilder.run(creep);
        } else if (repaierTargets.length > 0) {
          roleRepaierer.run(creep);
        } else {
          roleUpgrader.run(creep);
        }
        break;
      }

      case "repaierer": {
        const repaierTargets = creep.room.find(FIND_STRUCTURES, {
          filter: (object) => object.hits < object.hitsMax,
        });
        if (harvesters.length < minimumHarvesterCount) {
          roleHarvester.run(creep);
        } else if (repaierTargets.length > 0) {
          roleRepaierer.run(creep);
        } else {
          roleUpgrader.run(creep);
        }
        break;
      }

      case "attacker": {
        const targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length) {
          if (creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
              visualizePathStyle: { stroke: "#ff0000" },
            });
          }
        }
        break;
      }

      case "healer": {
        // TODO: SourceのIDを指定して、同時採掘可能な分のCreep数だけ割り当てる
        // TODO: Mapから、Sourceを取得し、同時採掘可能なCreep数を割り出す
        const targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length) {
          if (creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
              visualizePathStyle: { stroke: "#ff0000" },
            });
          }
        }
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
