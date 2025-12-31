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
  type VisibilityState,
} from "@tanstack/react-table";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import type { Pokemon } from "pokeapi-js-wrapper";
import MovesCell from "./MovesCell";
import { useCallback, useEffect, useState } from "react";
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { type SelectedCells, type GroupOfMoves } from "@/utils/typings";
import SelectableTableCell from "./SelectableTableCell";
import { getIndexedRows, getRangeData } from "@/utils/tableHelpers";
import { toast } from "react-toastify";
import HeaderCell from "./HeaderCell";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

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

const defaultColumnIds = [
  "name",
  "types",
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
  "total-stats",
  "moves",
  "knock-off",
  "ability-1",
  "ability-2",
  "hidden-ability",
];

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
    cell: (props) => (
      <a
        href={
          (
            ("https://www.smogon.com/dex/sm/pokemon/" +
              props.getValue()) as string
          ).split("-")[0]
        }
        target="_blank"
        key={props.cell.id}
      >
        {props.getValue() as string}
      </a>
    ),
    filterFn: (
      row: Row<Partial<Pokemon>>,
      columnId: string,
      filterValue: string[]
    ) => {
      const name = row.getValue(columnId) as string;
      return filterValue.includes(name);
    },
  }),
  columnHelper.accessor(
    (row) => row.types?.map((type) => type.type.name.toString()),
    {
      id: "types",
      header: "Type(s)",
      enableSorting: false,
      cell: (props) => (
        <div key={props.cell.id} className="flex gap-1 text-white">
          {(props.getValue() as string[]).map((type) => (
            <span
              key={props.cell.id + type}
              className={typeColors[type] + " px-2 py-1 rounded"}
            >
              {type}
            </span>
          ))}
        </div>
      ),
    }
  ),
  columnHelper.accessor(
    (row) => row.stats?.find((stat) => stat.stat.name === "hp")?.base_stat,
    {
      id: "hp",
      header: "Health",
      cell: (props) => (
        <h1 key={props.cell.id}>{props.getValue()?.toString()}</h1>
      ),
      sortingFn: (rowA, rowB) => statsFilterFn(rowA, rowB, "hp"),
    }
  ),
  columnHelper.accessor(
    (row) => row.stats?.find((stat) => stat.stat.name === "attack")?.base_stat,
    {
      id: "attack",
      header: "Attack",
      cell: (props) => (
        <h1 key={props.cell.id}>{props.getValue()?.toString() as string}</h1>
      ),
      sortingFn: (rowA, rowB) => statsFilterFn(rowA, rowB, "attack"),
    }
  ),
  columnHelper.accessor(
    (row) => row.stats?.find((stat) => stat.stat.name === "defense")?.base_stat,
    {
      id: "defense",
      header: "Defense",
      cell: (props) => (
        <h1 key={props.cell.id}>{props.getValue()?.toString() as string}</h1>
      ),
      sortingFn: (rowA, rowB) => statsFilterFn(rowA, rowB, "defense"),
    }
  ),
  columnHelper.accessor(
    (row) =>
      row.stats?.find((stat) => stat.stat.name === "special-attack")?.base_stat,
    {
      id: "special-attack",
      header: "Sp. Atk.",
      cell: (props) => (
        <h1 key={props.cell.id}>{props.getValue()?.toString() as string}</h1>
      ),
      sortingFn: (rowA, rowB) => statsFilterFn(rowA, rowB, "special-attack"),
    }
  ),
  columnHelper.accessor(
    (row) =>
      row.stats?.find((stat) => stat.stat.name === "special-defense")
        ?.base_stat,
    {
      id: "special-defense",
      header: "Sp. Def.",
      cell: (props) => (
        <h1 key={props.cell.id}>{props.getValue()?.toString() as string}</h1>
      ),
      sortingFn: (rowA, rowB) => statsFilterFn(rowA, rowB, "special-defense"),
    }
  ),
  columnHelper.accessor(
    (row) => row.stats?.find((stat) => stat.stat.name === "speed")?.base_stat,
    {
      id: "speed",
      header: "Speed",
      cell: (props) => (
        <h1 key={props.cell.id}>{props.getValue()?.toString() as string}</h1>
      ),
      sortingFn: (rowA, rowB) => statsFilterFn(rowA, rowB, "speed"),
    }
  ),
  columnHelper.accessor(
    (row) =>
      row.stats?.reduce(
        (accumulator, currentStat) => (accumulator += currentStat.base_stat),
        0
      ),
    {
      id: "total-stats",
      header: "Total Stats",
      cell: (props) => (
        <h1 key={props.cell.id}>{props.getValue()?.toString() as string}</h1>
      ),
    }
  ),
  // columnHelper.accessor("moves", {
  columnHelper.accessor((row) => row.moves?.map((move) => move?.move?.name), {
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
      const rowMoves = row.getValue(columnId) as string[];
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
  columnHelper.accessor(
    (row) =>
      row.moves?.map((move) => move?.move?.name).includes("knock-off")
        ? "Yes"
        : "No",
    {
      id: "knock-off",
      header: "Knock-off",
      cell: (props) => (
        <h1 key={props.cell.id}>{props.getValue() as string}</h1>
      ),
    }
  ),
  columnHelper.accessor(
    (row) => row.abilities?.find((ability) => ability.slot === 1)?.ability.name,
    {
      id: "ability-1",
      header: "Ability 1",
      enableSorting: false,
      cell: (props) => (
        <h1 key={props.cell.id}>{props.getValue() as string}</h1>
      ),
    }
  ),
  columnHelper.accessor(
    (row) => row.abilities?.find((ability) => ability.slot === 2)?.ability.name,
    {
      id: "ability-2",
      header: "Ability 2",
      enableSorting: false,
      cell: (props) => (
        <h1 key={props.cell.id}>{props.getValue() as string}</h1>
      ),
    }
  ),
  columnHelper.accessor(
    (row) =>
      row.abilities?.find((ability) => ability.is_hidden == true)?.ability.name,
    {
      id: "hidden-ability",
      header: "Hidden Ability",
      enableSorting: false,
      cell: (props) => (
        <h1 key={props.cell.id}>{props.getValue() as string}</h1>
      ),
    }
  ),
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
  const [columnVisibility] = useState(
    // columns.map((column) => ({ [column.id!]: false })) as VisibilityState
    columns.reduce((accumulator, currentColumn) => {
      return {
        ...accumulator,
        [currentColumn.id!]: defaultColumnIds.find(
          (id) => id === currentColumn.id!
        )
          ? true
          : false,
      };
    }, {} as VisibilityState)
  );
  const [columnOrder, setColumnOrder] = useState(() =>
    columns.map((column) => column.id!)
  );

  const table = useReactTable({
    data: pokemonList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnOrderChange: setColumnOrder,
    state: {
      columnFilters,
      pagination,
      columnVisibility,
      columnOrder,
    },
    initialState: {
      sorting: [{ id: "name", desc: false }],
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // this is not a good solution, but will work shoddily for now
    if (active && over && active.id === over.id) {
      //
      const column = table.getColumn(active.id.toString());
      const sortHandler = column?.getToggleSortingHandler();
      if (sortHandler) {
        sortHandler(event);
      }
    }
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    }

    console.log("ended!");
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const isLoading = pokemonList.length === 0;

  const [selectedCells, setSelectedCells] = useState<SelectedCells>({
    firstCell: [null, null],
    lastCell: [null, null],
  });

  const getMemoizedRangeData = useCallback(
    () => getRangeData(table.getSortedRowModel(), selectedCells),
    [table, selectedCells]
  );

  useEffect(() => {
    function handleKeyboardInput(event: KeyboardEvent) {
      (async () => {
        if (event.code === "KeyC" && event.ctrlKey) {
          const formattedText = getMemoizedRangeData();
          event.preventDefault();
          try {
            await navigator.clipboard.writeText(formattedText);
            toast("Successfully copied!");
          } catch (err) {
            console.error("Clipboard failed:", err);
            toast(err?.toString());
          }
        }
        if (event.code === "Escape") {
          setSelectedCells({ firstCell: [null, null], lastCell: [null, null] });
        }
      })();
    }
    document.addEventListener("keydown", handleKeyboardInput);
    return () => document.removeEventListener("keydown", handleKeyboardInput);
  }, [getMemoizedRangeData, table]);

  const indexedRows = getIndexedRows(table.getSortedRowModel());

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const headers = table.getHeaderGroups().map((headerGroup) => (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <SortableContext
          items={columnOrder}
          strategy={horizontalListSortingStrategy}
        >
          <HeaderCell header={header} />
        </SortableContext>
        // <TableHead
        //   key={header.id}
        //   className={`hover:bg-gray-300 w-64 ${
        //     header.column.getCanSort() ? " cursor-pointer" : ""
        //   }`}
        //   onClick={header.column.getToggleSortingHandler()}
        // >
        //   {flexRender(header.column.columnDef.header, header.getContext())}{" "}
        //   {header.column.getIsSorted()
        //     ? header.column.getIsSorted() === "desc"
        //       ? "↓"
        //       : "↑"
        //     : ""}
        // </TableHead>
      ))}
    </TableRow>
  ));

  const rows = table.getRowModel().rows.map((row) => (
    <TableRow key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <SelectableTableCell
          key={cell.id}
          className={`text-left text-gray-600 capitalize w-64`}
          row={indexedRows[cell.row.id]}
          column={cell.column.getIndex()}
          selectedCells={selectedCells}
          setSelectedCells={setSelectedCells}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </SelectableTableCell>
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
        } Pokemon out of ${table.getPreFilteredRowModel().rows.length}`}</h1>
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <Table className="overflow-y-auto">
            <TableHeader className="sticky top-0 bg-gray-50 z-10">
              {headers}
            </TableHeader>
            <TableBody>{rows}</TableBody>
          </Table>
        </DndContext>
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
