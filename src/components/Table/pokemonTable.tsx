import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnFilter,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { Pokemon } from "@/types/Pokemon";

// Example I wrote earlier
// const columnHelper = createColumnHelper<Pokemon>();

// const columns = [
//   columnHelper.accessor("name", {
//     header: "Name",
//     cell: (props) => <h1>{props.getValue() as string}</h1>,
//   }),
//   columnHelper.accessor("type", {
//     header: "Type(s)",
//     cell: (props) => (
//       <h1>{props.getValue().map((type) => type?.toString() + " ")}</h1> // temporary cell, will be icons/images later
//     ),
//   }),
//   columnHelper.accessor("stats.hp", {
//     header: "Health",
//     cell: (props) => <h1>{props.getValue().toString() as string}</h1>,
//   }),
//   columnHelper.accessor("stats.attack", {
//     header: "Attack",
//     cell: (props) => <h1>{props.getValue().toString() as string}</h1>,
//   }),
//   columnHelper.accessor("stats.defense", {
//     header: "Defense",
//     cell: (props) => <h1>{props.getValue().toString() as string}</h1>,
//   }),
//   columnHelper.accessor("stats.spatk", {
//     header: "Sp. Atk.",
//     cell: (props) => <h1>{props.getValue().toString() as string}</h1>,
//   }),
//   columnHelper.accessor("stats.spdef", {
//     header: "Sp. Def.",
//     cell: (props) => <h1>{props.getValue().toString() as string}</h1>,
//   }),
//   columnHelper.accessor("stats.speed", {
//     header: "Speed",
//     cell: (props) => <h1>{props.getValue().toString() as string}</h1>,
//   }),
// ];

// export function PokemonTable({
//   pokemonList,
//   columnFilters,
// }: {
//   pokemonList: Pokemon[];
//   columnFilters: ColumnFilter[];
// }) {
//   const table = useReactTable({
//     data: pokemonList,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     state: {
//       columnFilters,
//     },
//   });
//   const headers = table.getHeaderGroups().map((headerGroup) => (
//     <TableRow key={headerGroup.id}>
//       {headerGroup.headers.map((header) => (
//         <TableHead key={header.id}>
//           {header.column.columnDef.header as string}
//         </TableHead>
//       ))}
//     </TableRow>
//   ));
//   const rows = table.getCoreRowModel().rows.map((row) => (
//     <TableRow>
//       {row.getVisibleCells().map((cell) => (
//         <TableCell>
//           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//         </TableCell>
//       ))}
//     </TableRow>
//   ));
//   // const footers =

//   return (
//     <Table>
//       <TableHeader>{headers}</TableHeader>
//       <TableBody>{rows}</TableBody>
//     </Table>
//   );
// }
