import { findContainers } from "../find/findContainers";
import { CreepMemory } from "../../main";

export const withdrowEnegy = (creep: Creep) => {
  if ((creep.memory as CreepMemory).withdrowTargetId) {
    const sources: AnyStructure[] = [];
    sources.push(
      Game.getObjectById(
        (creep.memory as CreepMemory).withdrowTargetId
      ) as AnyStructure
    );
    switch (creep.withdraw(sources[0], RESOURCE_ENERGY)) {
      case ERR_NOT_IN_RANGE: {
        creep.moveTo(sources[0], {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
        break;
      }

      case ERR_NOT_ENOUGH_RESOURCES || ERR_INVALID_TARGET: {
        const targets = findContainers(creep);
        if (targets.length > 0) {
          (creep.memory as CreepMemory).withdrowTargetId = targets[0].id;
        }
        break;
      }

      default: {
        creep.withdraw(sources[0], RESOURCE_ENERGY);
        break;
      }
    }
  }
};
