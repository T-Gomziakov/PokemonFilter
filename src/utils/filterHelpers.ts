import type { ColumnFilter } from "@tanstack/react-table";
import type { MovesFilter, GroupOfMoves, Inclusion } from "./typings";

/**
 * Gets the next inclusion state
 *
 * ... > false > indeterminate > true > ...
 */
export function getNextInclusion(inclusion: Inclusion): Inclusion {
  if (inclusion === true) return false;
  if (inclusion === false) return "indeterminate";
  return true;
}

/**
 * Returns an existing MovesFilter object or makes a new one if it doesn't exist
 */
export function getMovesFilter(filter: ColumnFilter[]): MovesFilter {
  const movesFilter = filter.find((f) => f.id === "moves");
  if (!movesFilter)
    return {
      id: "moves",
      value: [] as GroupOfMoves[],
    } as MovesFilter;

  return movesFilter as MovesFilter;
}

export function replaceGroupOfMoves(
  filter: ColumnFilter[],
  groupOfMoves: GroupOfMoves
): ColumnFilter[] {
  const movesFilter = getMovesFilter(filter);
  const updatedGroupOfMoves = movesFilter.value
    .filter((group) => group.groupName !== groupOfMoves.groupName)
    .concat(groupOfMoves);

  const updatedFilter = filter
    .filter((f) => f.id !== "moves")
    .concat([{ id: "moves", value: updatedGroupOfMoves }]);

  return updatedFilter;
}

export function getGroupInclusion(
  filter: ColumnFilter[],
  groupName: string
): Inclusion {
  const movesFilter = getMovesFilter(filter);

  const moves = movesFilter.value.find(
    (group) => group.groupName === groupName
  )?.moves;

  if (!moves?.length) return false;

  // Check if no move is selected
  const falseCheck = moves.every((move) => move.inclusion === false);
  if (falseCheck) return false;
  // Check if all moves are selected
  const trueCheck = moves.every((move) => move.inclusion === true);
  if (trueCheck) return true;
  // Check if at least 1 move is selected
  const partialCheck = moves.some(
    (move) => move.inclusion === true || move.inclusion === "indeterminate"
  );
  if (partialCheck) return "indeterminate";

  return false;
}

export function setGroupInclusion(
  filter: ColumnFilter[],
  groupName: string,
  newInclusion: Inclusion
): ColumnFilter[] {
  const moveFilter = getMovesFilter(filter);

  const groupOfMoves =
    moveFilter.value.find((group) => group.groupName === groupName) ||
    ({} as GroupOfMoves);

  const newMoves = groupOfMoves.moves.map((move) => ({
    ...move,
    inclusion: newInclusion,
  }));

  groupOfMoves.moves = newMoves;
  const newFilter = replaceGroupOfMoves(filter, groupOfMoves);
  return newFilter;
}

export function advanceGroupInclusion(
  filter: ColumnFilter[],
  groupName: string
): ColumnFilter[] {
  const currentInclusion = getGroupInclusion(filter, groupName);

  const newFilter = setGroupInclusion(
    filter,
    groupName,
    getNextInclusion(currentInclusion)
  );

  return newFilter;
}

export function getMoveInclusion(
  filter: ColumnFilter[],
  groupName: string,
  moveName: string
): Inclusion {
  const moveFilter = getMovesFilter(filter);
  const moveGroup = moveFilter.value.find(
    (group) => group.groupName === groupName
  );
  return (
    moveGroup?.moves.find((move) => move.name === moveName)?.inclusion || false
  );
}
export function advanceMoveInclusion(
  filter: ColumnFilter[],
  groupName: string,
  moveName: string
): ColumnFilter[] {
  const movesFilter = getMovesFilter(filter);
  const currentInclusion = getMoveInclusion(filter, groupName, moveName);
  const newInclusion = getNextInclusion(currentInclusion);

  let groupOfMoves = movesFilter.value.find(
    (group) => group.groupName === groupName
  );

  if (!groupOfMoves) return filter;

  // TODO: make sure the move exists before it is concat'd
  const moves = groupOfMoves.moves.filter((move) => move.name !== moveName);
  moves.push({ name: moveName, inclusion: newInclusion });

  groupOfMoves = { ...groupOfMoves, moves: moves };
  const newFilter = replaceGroupOfMoves(filter, groupOfMoves);

  return newFilter;
}
export function resetGroupInclusion(
  filter: ColumnFilter[],
  groupName: string,
  moveName: string
): ColumnFilter[] {
  const movesFilter = getMovesFilter(filter);

  let groupOfMoves = movesFilter.value.find(
    (group) => group.groupName === groupName
  );

  if (!groupOfMoves) return filter;

  // TODO: make sure the move exists before it is concat'd
  const moves = groupOfMoves.moves.filter((move) => move.name !== moveName);
  moves.push({ name: moveName, inclusion: false });

  groupOfMoves = { ...groupOfMoves, moves: moves };
  const newFilter = replaceGroupOfMoves(filter, groupOfMoves);

  return newFilter;
}

export function resetAllGroupInclusions(
  filter: ColumnFilter[]
): ColumnFilter[] {
  const movesFilter = getMovesFilter(filter);
  const newGroupOfMoves = movesFilter.value.map(
    (moveGroup) =>
      ({
        groupName: moveGroup.groupName,
        moves: moveGroup.moves.map((move) => ({
          name: move.name,
          inclusion: false,
        })),
      } as GroupOfMoves)
  );
  movesFilter.value = newGroupOfMoves;

  const newFilter = filter.filter((f) => f.id !== "moves").concat(movesFilter);

  return newFilter;
}

export function getCurrentGroupState(filter: ColumnFilter[]): GroupOfMoves[] {
  const movesFilter = getMovesFilter(filter);
  return movesFilter.value;
}
