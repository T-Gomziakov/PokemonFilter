import type { CellContext } from "@tanstack/react-table";
import type { MoveElement, Pokemon } from "pokeapi-js-wrapper";

function MovesCell({
  cell,
  row,
  table,
}: Partial<CellContext<Partial<Pokemon>, MoveElement[] | undefined>>) {
  const moves =
    cell?.getValue()?.map((moveEntry) => <p>{moveEntry.move.name}</p>) || [];
  return <div className="overflow-auto h-32">{moves} </div>;
}

export default MovesCell;
