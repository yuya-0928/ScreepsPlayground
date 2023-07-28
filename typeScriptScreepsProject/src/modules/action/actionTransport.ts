import { findExtensions } from '../find/findExtensions';
import { findSpawners } from '../find/findSpawners';
import { actionMove } from './action.move';

const hasStore = (target: AnyStructure): target is StructureStorage => {
  return 'store' in target;
};

// TODO: 死んだCreepや放置されたEnergyを拾うようにする
export const actionTransport = (creep: Creep) => {
  // TODO: 運び先がMaxだったら、コンテナに戻す
  const spawners = findSpawners(creep);
  const extensions = findExtensions(creep);
  const sorted_extensions = extensions
    .filter(hasStore)
    .sort(
      (a, b) =>
        a.store.getFreeCapacity(RESOURCE_ENERGY) -
        b.store.getFreeCapacity(RESOURCE_ENERGY)
    );
  const targets = spawners.concat(sorted_extensions);

  const filtered_targets = targets.filter(hasStore).filter((target) => {
    return target.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
  });

  if (filtered_targets.length > 0) {
    if (
      creep.transfer(filtered_targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
    ) {
      actionMove(creep, filtered_targets[0]);
    }
  }
};
