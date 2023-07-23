import { CreepMemory } from "../main";

export const memoryManager = {
  refreshMemory: function (creep: Creep) {
    Object.keys(creep.memory).forEach((key) => {
      if (key !== "_move" && key !== "role") {
        (creep.memory as CreepMemory)[key] = undefined;
      }
    });
  },
};
