/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('getRandomInt');
 * mod.thing == 'a thing'; // true
 */

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

module.exports = getRandomInt;