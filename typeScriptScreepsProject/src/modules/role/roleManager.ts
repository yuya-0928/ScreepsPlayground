import { roleBuilder } from './role.builder';
import { roleHarvester } from './role.harvester';
import { roleRepaierer } from './role.repaierer';
import { roleTransporter } from './role.transporter';
import { roleUpgrader } from './role.upgrader';
import { roleAttacker } from './roleAttacker';
import { roleHealer } from './roleHealer';
import { CreepMemory } from '../../main';

export const roleManager = () => {
  for (let name in Game.creeps) {
    const creep = Game.creeps[name];
    switch ((creep.memory as CreepMemory).role) {
      case 'harvester': {
        roleHarvester.run(creep);
        break;
      }

      case 'transporter': {
        roleTransporter(creep);
        break;
      }

      case 'upgrader': {
        roleUpgrader.run(creep);
        break;
      }

      case 'builder': {
        roleBuilder.run(creep);
        break;
      }

      case 'repaierer': {
        roleRepaierer.run(creep);
        break;
      }

      case 'attacker': {
        roleAttacker(creep);
        break;
      }

      case 'healer': {
        roleHealer(creep);
        break;
      }
    }
  }
};
