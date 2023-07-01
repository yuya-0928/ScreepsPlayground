const memoryManager = {
  refreshMemory: function (creep) {
    Object.keys(creep.memory).forEach(key => {
      if (key !== '_move' && key !== 'role') {
        creep.memory[key] = undefined;
      }
    })
  }
}

module.exports = memoryManager;

