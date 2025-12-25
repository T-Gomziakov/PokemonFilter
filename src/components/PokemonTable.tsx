import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
import MovesCell from "./MovesCell";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import type { GroupOfMoves } from "@/utils/typings";

const typeColors: { [key: string]: string } = {
  fire: "bg-orange-500 hover:bg-orange-600",
  water: "bg-blue-500 hover:bg-blue-600",
  grass: "bg-green-500 hover:bg-green-600",
  electric: "bg-yellow-500 hover:bg-yellow-600",
  psychic: "bg-pink-500 hover:bg-pink-600",
  normal: "bg-gray-400 hover:bg-gray-500",
  fighting: "bg-red-600 hover:bg-red-700",
  flying: "bg-indigo-400 hover:bg-indigo-500",
  poison: "bg-purple-500 hover:bg-purple-600",
  ground: "bg-amber-600 hover:bg-amber-700",
  rock: "bg-stone-600 hover:bg-stone-700",
  bug: "bg-lime-500 hover:bg-lime-600",
  ghost: "bg-violet-600 hover:bg-violet-700",
  steel: "bg-slate-500 hover:bg-slate-600",
  ice: "bg-cyan-400 hover:bg-cyan-500",
  dragon: "bg-indigo-600 hover:bg-indigo-700",
  dark: "bg-gray-700 hover:bg-gray-800",
  fairy: "bg-pink-400 hover:bg-pink-500",
};

const statsFilterFn = (
  rowA: Row<Partial<Pokemon>>,
  rowB: Row<Partial<Pokemon>>,
  stat:
    | "hp"
    | "attack"
    | "defense"
    | "special-attack"
    | "special-defense"
    | "speed"
) => {
  const rowAHp = rowA.original.stats?.find((entry) => entry.stat.name === stat);
  const rowBHp = rowB.original.stats?.find((entry) => entry.stat.name === stat);
  return (rowAHp?.base_stat ?? 0) - (rowBHp?.base_stat ?? 0);
};

const columnHelper = createColumnHelper<Partial<Pokemon>>();

const columns = [
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
    cell: (props) => <h1 key={props.cell.id}>{props.getValue() as string}</h1>,
  }),
  columnHelper.accessor("types", {
    id: "types",
    header: "Type(s)",
    enableSorting: false,
    cell: (props) => (
      <div key={props.cell.id} className="flex gap-1 text-white">
        {(props.getValue() as Pokemon["types"]).map((type) => (
          <span
            key={props.cell.id + type.type.name.toString()}
            className={
              typeColors[type.type.name.toString()] + " px-2 py-1 rounded"
            }
          >
            {type?.type?.name.toString()}
          </span>
        ))}
      </div>
    ),
  }),
  columnHelper.accessor("stats", {
    id: "stats/hp",
    header: "Health",
    cell: (props) => (
      <h1 key={props.cell.id}>
        {
          props
            .getValue()
            ?.find((entry) => entry.stat.name === "hp")
            ?.base_stat?.toString() as string
        }
      </h1>
    ),
    sortingFn: (rowA, rowB) => statsFilterFn(rowA, rowB, "hp"),
  }),
  columnHelper.accessor("stats", {
    id: "stats/attack",
    header: "Attack",
    cell: (props) => (
      <h1 key={props.cell.id}>
        {
          props
            .getValue()
            ?.find((entry) => entry.stat.name == "attack")
            ?.base_stat.toString() as string
        }
      </h1>
    ),
    sortingFn: (rowA, rowB) => statsFilterFn(rowA, rowB, "attack"),
  }),
  columnHelper.accessor("stats", {
    id: "stats/defense",
    header: "Defense",
    cell: (props) => (
      <h1 key={props.cell.id}>
        {
          props
            .getValue()
            ?.find((entry) => entry.stat.name == "defense")
            ?.base_stat.toString() as string
        }
      </h1>
    ),
    sortingFn: (rowA, rowB) => statsFilterFn(rowA, rowB, "defense"),
  }),
  columnHelper.accessor("stats", {
    id: "stats/special-attack",
    header: "Sp. Atk.",
    cell: (props) => (
      <h1 key={props.cell.id}>
        {
          props
            .getValue()
            ?.find((entry) => entry.stat.name == "special-attack")
            ?.base_stat.toString() as string
        }
      </h1>
    ),
    sortingFn: (rowA, rowB) => statsFilterFn(rowA, rowB, "special-attack"),
  }),
  columnHelper.accessor("stats", {
    id: "stats/special-defense",
    header: "Sp. Def.",
    cell: (props) => (
      <h1 key={props.cell.id}>
        {
          props
            .getValue()
            ?.find((entry) => entry.stat.name == "special-defense")
            ?.base_stat.toString() as string
        }
      </h1>
    ),
    sortingFn: (rowA, rowB) => statsFilterFn(rowA, rowB, "special-defense"),
  }),
  columnHelper.accessor("stats", {
    id: "stats/speed",
    header: "Speed",
    cell: (props) => (
      <h1 key={props.cell.id}>
        {
          props
            .getValue()
            ?.find((entry) => entry.stat.name == "speed")
            ?.base_stat.toString() as string
        }
      </h1>
    ),
    sortingFn: (rowA, rowB) => statsFilterFn(rowA, rowB, "speed"),
  }),
  columnHelper.accessor("moves", {
    id: "moves",
    header: "Moves",
    enableSorting: false,
    cell: (props) => (
      <MovesCell cell={props.cell} row={props.row} table={props.table} />
    ),
    filterFn: (
      row: Row<Partial<Pokemon>>,
      columnId: string,
      filterValue: GroupOfMoves[]
    ) => {
      // Get all the moves' names of the pokemon
      const rowMoves = (row.getValue(columnId) as Pokemon["moves"]).map(
        (moveElement) => moveElement.move.name
      );
      // For each group, perform a moveset check
      for (const moveGroup of filterValue) {
        if (moveGroup.moves.every((move) => move.inclusion === false)) continue;
        // Check if the group includes all true moves
        const trueMoves = moveGroup.moves.filter(
          (move) => move.inclusion === true
        );
        let trueCheck = false;
        if (trueMoves.length) {
          trueCheck = trueMoves.every((move) =>
            rowMoves.includes(move.name.toLowerCase().replace(" ", "-"))
          );
          if (!trueCheck) return false;
        }
        // Check if the group includes at least 1 indeterminate move OR we have a true move
        const indeterminateMoves = moveGroup.moves.filter(
          (move) => move.inclusion === "indeterminate"
        );
        if (indeterminateMoves.length) {
          const indeterminateCheck = indeterminateMoves.some((move) =>
            rowMoves.includes(move.name.toLowerCase().replace(" ", "-"))
          );
          if (!indeterminateCheck && !trueCheck) return false;
        }
      }
      // We passed all the checks, render the row
      return true;
    },
  }),
];

export function PokemonTable({
  pokemonList,
  columnFilters,
}: {
  pokemonList: Partial<Pokemon>[];
  columnFilters: ColumnFilter[];
}) {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 20, //default page size
  });
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [columnFilters]);
  const table = useReactTable({
    data: pokemonList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
      pagination,
    },
  });

  const isLoading = pokemonList.length === 0;

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const headers = table.getHeaderGroups().map((headerGroup) => (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <TableHead
          key={header.id}
          className={`hover:bg-gray-300 w-64 ${
            header.column.getCanSort() ? " cursor-pointer" : ""
          }`}
          onClick={header.column.getToggleSortingHandler()}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}{" "}
          {header.column.getIsSorted()
            ? header.column.getIsSorted() === "desc"
              ? "↓"
              : "↑"
            : ""}
        </TableHead>
      ))}
    </TableRow>
  ));

  const rows = table.getRowModel().rows.map((row) => (
    <TableRow key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={`text-left text-gray-600 capitalize w-64`}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  ));

  return (
    <>
      <div
        id="table-container"
        className="mx-auto w-full bg-white rounded-lg shadow-2xl p-4"
      >
        <h1>{`Showing ${
          table.getFilteredRowModel().rows.length
        } Pokemon out of ${table.getCoreRowModel().rows.length}`}</h1>
        <Table className="overflow-y-auto">
          <TableHeader className="sticky top-0 bg-gray-50 z-10">
            {headers}
          </TableHeader>
          <TableBody>{rows}</TableBody>
        </Table>
        <div id="pagination" className="flex flex-row">
          <Pagination className="my-auto">
            <PaginationPrevious
              href={table.getCanPreviousPage() ? "#" : undefined}
              isActive={table.getCanPreviousPage()}
              onClick={(e) => {
                if (!table.getCanPreviousPage()) return;
                e.preventDefault();
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex - 1,
                }));
              }}
            />
            <PaginationNext
              href={table.getCanNextPage() ? "#" : undefined}
              isActive={table.getCanNextPage()}
              onClick={(e) => {
                if (!table.getCanNextPage()) return;
                e.preventDefault();
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex + 1,
                }));
              }}
            />
          </Pagination>
          <div id="page-info" className="w-32 my-auto ">
            <p>
              Page {pagination.pageIndex > 0 ? pagination.pageIndex + 1 : 1} of{" "}
              {table.getPageCount()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
