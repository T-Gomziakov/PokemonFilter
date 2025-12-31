import { flexRender, type Header } from "@tanstack/react-table";
import type { Pokemon } from "pokeapi-js-wrapper";
import { type ReactNode } from "react";
import { TableHead } from "./ui/table";
import { useSortable } from "@dnd-kit/sortable";

type HeaderCellProps = {
  children?: ReactNode;
  header: Header<Partial<Pokemon>, unknown>;
};

function HeaderCell({ children, header }: HeaderCellProps) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: header.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  return (
    <TableHead ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <span className="flex flex-row text-center items-center">
        <h1>
          {flexRender(header.column.columnDef.header, header.getContext())}
        </h1>
        <h1 className="ml-2">
          {header.column.getIsSorted()
            ? header.column.getIsSorted() === "desc"
              ? "↑"
              : "↓"
            : "-"}
        </h1>
      </span>
      {children}
    </TableHead>
  );
  // return children;
}

export default HeaderCell;
