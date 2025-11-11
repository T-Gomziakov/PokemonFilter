import type { CellContext } from "@tanstack/react-table";
import type { MoveElement, Pokemon } from "pokeapi-js-wrapper";
import { ScrollArea } from "./ui/scroll-area";
import type { MoveGroupsFilter } from "./FilterList";
import { useEffect } from "react";

function MovesCell({
  cell,
  row,
  table,
}: // row,
// table,
Partial<CellContext<Partial<Pokemon>, MoveElement[] | undefined>>) {
  const movesFilter = (
    (table?.getColumn("moves")?.getFilterValue() || []) as MoveGroupsFilter[]
  ).filter((group) => group.moves.some((move) => move.inclusion !== false));

  // Parsed moves filter that contains only moves that are active ("indeterminated" or true state)
  const activeMoves = movesFilter.map((filter) => ({
    ...filter,
    moves: filter.moves
      .filter((move) => move.inclusion !== false)
      .map((filterMove) => ({
        ...filterMove,
        name: filterMove.name.toLowerCase().replace(" ", "-"),
      })),
  }));

  const cellMoves =
    cell?.getValue()?.map((moveEntry) => moveEntry.move.name) || [];

  return (
    <ScrollArea key={cell?.id} className="overflow-auto h-32 w-32">
      {activeMoves.length > 0
        ? activeMoves.map((group) => (
            <div>
              <h4 className="font-bold mt-2">{group.groupName}</h4>
              {cellMoves
                .filter((cellMove2) =>
                  group.moves
                    .map((groupMove) => groupMove.name)
                    .includes(cellMove2)
                )
                .map((cellMove) => (
                  <p>{cellMove}</p>
                ))}
            </div>
          ))
        : cellMoves.map((cellMove) => <p>{cellMove}</p>)}
    </ScrollArea>
  );
}

export default MovesCell;
