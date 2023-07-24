export const actionMove = (
  creep: Creep,
  target: RoomPosition | { pos: RoomPosition }
) => {
  creep.moveTo(target, {
    visualizePathStyle: { stroke: "#ffffff" },
  });
};
