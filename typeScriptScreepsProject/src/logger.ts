export const logger = {
  creepCountInfo(
    harvesters: Creep[],
    upgraders: Creep[],
    builders: Creep[],
    repaierers: Creep[]
  ) {
    console.log(
      "harvesters: " + harvesters.length,
      "upgraders: " + upgraders.length,
      "builders: " + builders.length,
      "repaierers: " + repaierers.length
    );
  },
};
