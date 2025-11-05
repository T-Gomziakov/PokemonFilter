import type { CellContext } from "@tanstack/react-table";
import type { MoveElement, Pokemon } from "pokeapi-js-wrapper";
import { ScrollArea } from "./ui/scroll-area";

function MovesCell({
  cell,
}: // row,
// table,
Partial<CellContext<Partial<Pokemon>, MoveElement[] | undefined>>) {
  const moves =
    cell
      ?.getValue()
      ?.map((moveEntry) => (
        <p key={moveEntry.move.name + moveEntry.move.url}>
          {moveEntry.move.name}
        </p>
      )) || [];
  return (
    <ScrollArea key={cell?.id} className="overflow-auto h-32 w-32">
      {moves}
    </ScrollArea>
  );
}

export default MovesCell;
