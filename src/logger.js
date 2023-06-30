const logger = {
  creepCountInfo(harvesters, upgraders, builders) {
    console.log(
      'harvesters: ' + harvesters.length,
      'upgraders: ' + upgraders.length,
      'builders: ' + builders.length
    );
  }
}

module.exports = logger;