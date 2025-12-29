import type { ColumnFilter } from "@tanstack/react-table";
import type { GroupOfMoves } from "./typings";
import * as MoveGroups from "@/data/moveGroups";

export function getDefaultMoveGroups(): GroupOfMoves[] {
  const defaultGroupOfMoves = Object.values(MoveGroups).map((category) => ({
    groupName: category.groupName,
    moves: category.moves.map((move) => ({ name: move, inclusion: false })),
  })) as GroupOfMoves[];

  return defaultGroupOfMoves;
}

export function getDefaultTableFilter(): ColumnFilter[] {
  return [
    {
      id: "moves",
      value: getDefaultMoveGroups(),
    },
  ];
}
