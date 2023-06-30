const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const managementCreepCount = require('managementCreepCount');

module.exports.loop = function () {
  const harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == 'harvester'
  );
  if (harvesters.length < managementCreepCount.harvester) {
    let newName = 'Harvester' + Game.time;
    console.log('Spawning new harvester: ' + newName);
    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName, {
      memory: { role: 'harvester' },
    });
  }

  const upgraders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == 'upgrader'
  );
  if (
    harvesters.length == managementCreepCount.harvester &&
    upgraders.length < managementCreepCount.upgrader
  ) {
    const newName = 'Upgrader' + Game.time;
    console.log('Spawning new harvester: ' + newName);
    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName, {
      memory: { role: 'upgrader' },
    });
  }

  const builders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == 'builder'
  );
  if (
    harvesters.length == managementCreepCount.harvester &&
    upgraders.length == managementCreepCount.upgrader &&
    builders.length < managementCreepCount.builder
  ) {
    const newName = 'Builder' + Game.time;
    console.log('Spawning new builder: ' + newName);
    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName, {
      memory: { role: 'builder' },
    });
  }

  console.log(
    'harvesters: ' + harvesters.length,
    'upgraders: ' + upgraders.length,
    'builders: ' + builders.length
  );

  if (Game.spawns['Spawn1'].spawning) {
    const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    Game.spawns['Spawn1'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x + 1,
      Game.spawns['Spawn1'].pos.y,
      { align: 'left', opacity: 0.8 }
    );
  }

  for (let name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role == 'harvester') {
      const harvestingTargets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });
      if (harvestingTargets.length === 0) {
        roleUpgrader.run(creep);
      } else {
        roleHarvester.run(creep);
      }
    }
    if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == 'builder') {
      const buildingTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (harvesters.length < 3) {
        roleHarvester.run(creep);
      } else if (buildingTargets.length === 0) {
        roleUpgrader.run(creep);
      } else {
        roleBuilder.run(creep);
      }
    }
  }
};
