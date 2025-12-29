import type { CellContext } from "@tanstack/react-table";
import type { Pokemon } from "pokeapi-js-wrapper";
import { ScrollArea } from "./ui/scroll-area";
import { getActiveGroupsOfMoves, getActiveMoves } from "@/utils/movesHelpers";

function MovesCell({
  cell,
  table,
}: // row,
Partial<CellContext<Partial<Pokemon>, string[] | undefined>>) {
  const movesFilter = getActiveGroupsOfMoves(table!);

  // Parsed moves filter that contains only moves that are active ("indeterminated" or true state)
  const activeMoves = getActiveMoves(movesFilter);

  const cellMoves = cell?.getValue();

  return (
    <ScrollArea key={cell?.id} className="overflow-auto h-32 w-32">
      {activeMoves.length > 0
        ? activeMoves.map((group) => (
            <div>
              <h4 className="font-bold mt-2">{group.groupName}</h4>
              {cellMoves
                ?.filter((cellMove2) =>
                  group.moves
                    .map((groupMove) => groupMove.name)
                    .includes(cellMove2)
                )
                .map((cellMove) => (
                  <p>{cellMove}</p>
                ))}
            </div>
          ))
        : cellMoves?.map((cellMove) => <p>{cellMove}</p>)}
    </ScrollArea>
  );
}

export default MovesCell;
