const logger = {
  creepCountInfo(harvesters, upgraders, builders, repaierers) {
    console.log(
      'harvesters: ' + harvesters.length,
      'upgraders: ' + upgraders.length,
      'builders: ' + builders.length,
      'repaierers: ' + repaierers.length,
    );
  }
}

module.exports = logger;