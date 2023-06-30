const getRandomInt = require('getRandomInt');

const registMemorySource = {
  randomFind: function (creep) {
    const sources = creep.room.find(FIND_SOURCES);
    const randTargetId = sources[getRandomInt(sources.length)].id;
    creep.memory.harvestTargetId = randTargetId;
  }
}

module.exports = registMemorySource;