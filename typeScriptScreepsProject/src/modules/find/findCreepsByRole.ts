import { filter } from "lodash";
import { CreepMemory } from "../../main";

export const findCreepsByRole = (role: string) => {
  return filter(
    Game.creeps,
    (creep: Creep) => (creep.memory as CreepMemory).role == role
  );
};
