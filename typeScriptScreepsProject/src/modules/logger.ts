import { caluclateCreepCost } from "../managementCreep";
import { creepStatus } from "../managementCreep";

export const logger = {
  creepCountInfo: (
    harvesters: Creep[],
    upgraders: Creep[],
    builders: Creep[],
    repaierers: Creep[]
  ) => {
    console.log(
      "harvesters: " + harvesters.length,
      "upgraders: " + upgraders.length,
      "builders: " + builders.length,
      "repaierers: " + repaierers.length
    );
  },

  caluclateCreepCost: () => {
    console.log(
      "harvesters_cost: " + caluclateCreepCost(creepStatus.harvester),
      "upgraders_cost: " + caluclateCreepCost(creepStatus.upgrader),
      "builders_cost: " + caluclateCreepCost(creepStatus.builder),
      "repaierers_cost: " + caluclateCreepCost(creepStatus.repaierer)
    );
  },
};
