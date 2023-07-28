export const findAccessibleSourcePositions = (source: Source) => {
  let accessibleTiles = 0;

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      const pos = new RoomPosition(
        source.pos.x + x,
        source.pos.y + y,
        source.room.name
      );
      const terrain = pos.lookFor(LOOK_TERRAIN);
      if (!terrain.includes('wall')) accessibleTiles++;
    }
  }

  return accessibleTiles;
};
