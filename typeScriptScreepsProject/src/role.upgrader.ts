const findTarget = require("./findTarget");
const actionHarvest = require("./action.harvest");
const memoryManager = require("./memoryManager");
import { CreepMemory } from "./main";

export const roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep: Creep) {
    if (
      (creep.memory as CreepMemory).upgrading &&
      creep.store[RESOURCE_ENERGY] == 0
    ) {
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).upgrading = false;
      const randTargetId = findTarget.randomSourcesFind(creep);
      (creep.memory as CreepMemory).harvestTargetId = randTargetId;
      creep.say("🔄 harvest");
    }
    if (
      !(creep.memory as CreepMemory).upgrading &&
      creep.store.getFreeCapacity() == 0
    ) {
      memoryManager.refreshMemory(creep);
      (creep.memory as CreepMemory).upgrading = true;
      creep.say("⚡ upgrade");
    }

    if ((creep.memory as CreepMemory).upgrading) {
      if (
        creep.room.controller &&
        creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
    } else {
      actionHarvest.run(creep);
    }
  },
};

module.exports = roleUpgrader;
