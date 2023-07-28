import { CreepMemory } from '../../main';
import { actionMove } from './action.move';
import { findSources } from '../find/findSources';
import { findAccessibleSourcePositions } from '../find/findAvelableHarvestCreepCount';
import { findCreepsByRole } from '../find/findCreepsByRole';

export const actionHarvest = {
  run: function (creep: Creep) {
    if ((creep.memory as CreepMemory).harvestTargetId === undefined) {
      const sources = findSources(creep);

      // CreepのMemoryにAccessibleSourcePositionsを保存する
      const countAccessibleSourcePositions = [];
      for (const source of sources) {
        const sourcePositions = findAccessibleSourcePositions(source);
        countAccessibleSourcePositions.push({
          source: source,
          accessibleCount: sourcePositions,
          harvestingCount: 0,
        });
      }

      // AccessibleSourcePositionsが最も多いsourceを選択する
      countAccessibleSourcePositions.sort((a, b) => {
        return b.accessibleCount - a.accessibleCount;
      });

      // 全てのharvesterを取得
      const harvesters = findCreepsByRole('harvester');

      // どのsourceにどれだけのharvestが稼働しているか確認する
      const harvestersHarvestingSource = [];
      for (const harvester of harvesters) {
        harvestersHarvestingSource.push({
          source: (harvester.memory as CreepMemory).harvestTargetId,
        });
      }
      const count: Record<string, number> = {};
      for (let i = 0; i < harvestersHarvestingSource.length; i++) {
        const element = harvestersHarvestingSource[i];
        count[element.source] = (count[element.source] || 0) + 1;
      }

      // countAccessibleSourcePositionsにcountの情報を追加する
      for (const countAccessibleSourcePosition of countAccessibleSourcePositions) {
        countAccessibleSourcePosition.harvestingCount =
          count[countAccessibleSourcePosition.source.id];
      }

      // harvestするsourceを決定する
      for (const AccessibleSource of countAccessibleSourcePositions) {
        const harvestingCount = AccessibleSource.harvestingCount || 0;
        if (AccessibleSource.accessibleCount > harvestingCount) {
          (creep.memory as CreepMemory).harvestTargetId =
            AccessibleSource.source.id;
          AccessibleSource.harvestingCount = harvestingCount + 1;
          break;
        }
      }

      // Memoryに保存する
      (creep.memory as CreepMemory).accessibleSourcePositions =
        countAccessibleSourcePositions;
    }

    const targetSource = Game.getObjectById<Source>(
      (creep.memory as CreepMemory).harvestTargetId
    );
    if (targetSource) {
      switch (creep.harvest(targetSource)) {
        case ERR_NOT_IN_RANGE: {
          actionMove(creep, targetSource);
          break;
        }
        default: {
          creep.harvest(targetSource);
          break;
        }
      }
    } else {
      console.log('Invalid source id stored in creep memory');
    }
  },
};
