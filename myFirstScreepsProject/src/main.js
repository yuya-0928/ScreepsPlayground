const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const managementCreepCount = require('managementCreepCount');
const spawnHarvester = require('./spawn.harvester');
const spawnBuilder = require('./spawn.builder');
const spawnUpgrader = require('./spawn.upgrader');
const logger = require('./logger');
const findTarget = require('./findTarget');
const roleRepaierer = require('./role.repaierer');
const spawnRepaierer = require('./spawn.repaierer');
const deleteDeadCreepMemory = require('./deleteDeadCreepMemory');

deleteDeadCreepMemory();

const findCreepsByRole = (role) => {
  return _.filter(Game.creeps, (creep) => creep.memory.role == role);
};

const spawnerStatus = {
  show: function (spawn) {
    if (spawn.spawning) {
      const spawningCreep = Game.creeps[spawn.spawning.name];
      spawn.room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        spawn.pos.x + 1,
        spawn.pos.y,
        { align: 'left', opacity: 0.8 }
      );
    }
  }
}

module.exports.loop = function () {
  const harvesters = findCreepsByRole('harvester')
  if (harvesters.length < managementCreepCount.harvester) {
    spawnHarvester.run(Game.spawns['Spawn1']);
  }

  const upgraders = findCreepsByRole('upgrader')
  if (
    harvesters.length == managementCreepCount.harvester &&
    upgraders.length < managementCreepCount.upgrader
  ) {
    spawnUpgrader.run(Game.spawns['Spawn1']);
  }

  const builders = findCreepsByRole('builder')
  if (
    harvesters.length == managementCreepCount.harvester &&
    upgraders.length == managementCreepCount.upgrader &&
    builders.length < managementCreepCount.builder
  ) {
    spawnBuilder.run(Game.spawns['Spawn1']);
  }

  const repaierers = findCreepsByRole('repaierer')
  if (
    harvesters.length == managementCreepCount.harvester &&
    upgraders.length == managementCreepCount.upgrader &&
    builders.length == managementCreepCount.builder &&
    repaierers.length < managementCreepCount.repaierer
  ) {
    spawnRepaierer.run(Game.spawns['Spawn1']);
  }

  spawnerStatus.show(Game.spawns['Spawn1']);


  for (let name in Game.creeps) {
    const creep = Game.creeps[name];
    switch (creep.memory.role) {
      case 'harvester': {
        const harvestingTargets = findTarget.filling(creep);
        if (harvestingTargets.length === 0) {
          roleUpgrader.run(creep);
        } else {
          roleHarvester.run(creep);
        }
        break;
      }

      case 'upgrader': {
        roleUpgrader.run(creep);
        break;
      }

      case 'builder': {
        const buildingTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
        const repaierTargets = creep.room.find(FIND_STRUCTURES, {
          filter: object => object.hits < object.hitsMax
        });
        if (harvesters.length < 3) {
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

      case 'repaierer': {
        const repaierTargets = creep.room.find(FIND_STRUCTURES, {
          filter: object => object.hits < object.hitsMax
        });
        if (harvesters.length < 3) {
          roleHarvester.run(creep);
        } else if (repaierTargets.length > 0) {
          roleRepaierer.run(creep);
        } else {
          roleUpgrader.run(creep);
        }
        break;
      }

      case 'attacker': {
        const targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length) {
          if (creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ff0000' } });
          }
        }
        break
      }

      case 'healer': {
        const targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length) {
          if (creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ff0000' } });
          }
        }
        break;
      }
    }
  }

  logger.creepCountInfo(harvesters, upgraders, builders, repaierers);
};
