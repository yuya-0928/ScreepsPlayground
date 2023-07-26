import { caluclateCreepCost } from "../managementCreep";
import { creepStatus } from "../managementCreep";
import { findTarget } from "./findTarget";

export const logger = {
  creepCountInfo: (
    harvesters: Creep[],
    transporters: Creep[],
    upgraders: Creep[],
    builders: Creep[],
    repaierers: Creep[]
  ) => {
    console.log(
      "harvesters: " + harvesters.length,
      "transporters: " + transporters.length,
      "upgraders: " + upgraders.length,
      "builders: " + builders.length,
      "repaierers: " + repaierers.length
    );
  },

  creepCosts: () => {
    console.log(
      "harvesters_cost: " + caluclateCreepCost(creepStatus.harvester),
      "transporters_cost: " + caluclateCreepCost(creepStatus.transporters),
      "upgraders_cost: " + caluclateCreepCost(creepStatus.upgrader),
      "builders_cost: " + caluclateCreepCost(creepStatus.builder),
      "repaierers_cost: " + caluclateCreepCost(creepStatus.repaierer)
    );
  },

  sourceCountBuildingCreep: () => {
    console.log(
      "sourceCountBuildingCreep: " + findTarget.sourceBuildingCreep()
    );
  },
};
