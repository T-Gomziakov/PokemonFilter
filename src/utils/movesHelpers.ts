import type { Table } from "@tanstack/react-table";
import type { GroupOfMoves } from "./typings";
import type { Pokemon } from "pokeapi-js-wrapper";

export function getActiveMoves(movesFilter: GroupOfMoves[]) {
  return movesFilter.map((filter) => ({
    ...filter,
    moves: filter.moves
      .filter((move) => move.inclusion !== false)
      .map((filterMove) => ({
        ...filterMove,
        name: filterMove.name.toLowerCase().replace(" ", "-"),
      })),
  }));
}

export function getActiveGroupsOfMoves(table: Table<Partial<Pokemon>>) {
  return (
    (table?.getColumn("moves")?.getFilterValue() || []) as GroupOfMoves[]
  ).filter((group) => group.moves.some((move) => move.inclusion !== false));
}
