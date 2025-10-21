import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFilter,
  type Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Pokemon } from "pokeapi-js-wrapper";
import type { MoveFilterDef } from "./PokemonTextInput";
import { useEffect } from "react";
const columnHelper = createColumnHelper<Partial<Pokemon>>();

const columns = [
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
    cell: (props) => <h1>{props.getValue() as string}</h1>,
  }),
  columnHelper.accessor("types", {
    id: "types",
    header: "Type(s)",
    cell: (props) => (
      <h1>
        {(props.getValue() as Pokemon["types"]).map(
          (type) => type?.type?.name.toString() + " "
        )}
      </h1> // temporary cell, will be icons/images later
    ),
  }),
  columnHelper.accessor("stats", {
    id: "stats/hp",
    header: "Health",
    cell: (props) => (
      <h1>
        {
          props
            .getValue()
            ?.find((entry) => entry.stat.name === "hp")
            ?.base_stat?.toString() as string
        }
      </h1>
    ),
  }),
  columnHelper.accessor("stats", {
    id: "stats/attack",
    header: "Attack",
    cell: (props) => (
      <h1>
        {
          props
            .getValue()
            ?.find((entry) => entry.stat.name == "attack")
            ?.base_stat.toString() as string
        }
      </h1>
    ),
  }),
  columnHelper.accessor("stats", {
    id: "stats/defense",
    header: "Defense",
    cell: (props) => (
      <h1>
        {
          props
            .getValue()
            ?.find((entry) => entry.stat.name == "defense")
            ?.base_stat.toString() as string
        }
      </h1>
    ),
  }),
  columnHelper.accessor("stats", {
    id: "stats/special-attack",
    header: "Sp. Atk.",
    cell: (props) => (
      <h1>
        {
          props
            .getValue()
            ?.find((entry) => entry.stat.name == "special-attack")
            ?.base_stat.toString() as string
        }
      </h1>
    ),
  }),
  columnHelper.accessor("stats", {
    id: "stats/special-defense",
    header: "Sp. Def.",
    cell: (props) => (
      <h1>
        {
          props
            .getValue()
            ?.find((entry) => entry.stat.name == "special-defense")
            ?.base_stat.toString() as string
        }
      </h1>
    ),
  }),
  columnHelper.accessor("stats", {
    id: "stats/speed",
    header: "Speed",
    cell: (props) => (
      <h1>
        {
          props
            .getValue()
            ?.find((entry) => entry.stat.name == "speed")
            ?.base_stat.toString() as string
        }
      </h1>
    ),
  }),
  columnHelper.accessor("moves", {
    id: "moves",
    header: "Moves",
    cell: (props) => (
      <div>
        {props.getValue()?.map((moveElem) => moveElem.move.name + "\n")}
      </div>
    ),
    filterFn: "arrIncludesAll",
  }),
];

export function PokemonTable({
  pokemonList,
  columnFilters,
}: {
  pokemonList: Partial<Pokemon>[];
  columnFilters: ColumnFilter[];
}) {
  const table = useReactTable({
    data: pokemonList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
    },
  });

  const headers = table.getHeaderGroups().map((headerGroup) => (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <TableHead key={header.id}>
          {flexRender(header.column.columnDef.header, header.getContext())}
        </TableHead>
      ))}
    </TableRow>
  ));

  const rows = table.getRowModel().rows.map((row) => (
    <TableRow key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  ));

  useEffect(() => {
    console.log(table.getState().columnFilters);
  }, [table.getState().columnFilters]);

  return (
    <Table>
      <TableHeader>{headers}</TableHeader>
      <TableBody>{rows}</TableBody>
    </Table>
  );
}
