/* eslint-disable no-unexpected-multiline */
import type { RowModel } from "@tanstack/react-table";
import type { SelectedCells } from "./typings";
import { getRowRange, getColumnRange } from "./selectedCellHelpers";

// The problem is that sorted row model has indices of an un-sorted row model
// We fix it by allowing us to use row.id to get an index in the table
// Later, we can use the index in a rowModel.rows to get all the info about that row using the index
/**
 * Get an object where the keys are row.id and map to the index within the table
 *
 * Example: row with row.id "1000" maps to index 0 because its the first entry in the table
 *
 *
 * @param rowModel the row model of the table, usually done with table.getRowModel()
 */
export function getIndexedRows<Type>(rowModel: RowModel<Type>) {
  return rowModel.rows.reduce((final, row, index) => {
    final[row.id] = index;
    return final;
  }, {} as { [key: string]: number });
}

export function getRangeData<Type>(
  rowModel: RowModel<Type>,
  selectedCells: SelectedCells
) {
  const rowRange = getRowRange(selectedCells);
  const columnRange = getColumnRange(selectedCells);

  const rows = rowModel.rows;

  const finalOutput = [];

  console.log(rowRange);

  for (let rowIndex = rowRange[0]; rowIndex <= rowRange[1]; rowIndex++) {
    for (
      let columnIndex = columnRange[0];
      columnIndex <= columnRange[1];
      columnIndex++
    ) {
      const currentEntry = rows[rowIndex]
        .getVisibleCells()
        [columnIndex].getValue();

      const columnId = rows[rowIndex]
        .getVisibleCells()
        [columnIndex].getContext().column.id;

      if (columnId === "moves") {
        // Do a custom moves render
      } else if (columnId === "types") {
        (currentEntry as []).forEach((type: string, index) => {
          finalOutput.push(type[0].toLocaleUpperCase() + type.slice(1));
          if (index < (currentEntry as []).length - 1) {
            finalOutput.push(`\t`);
          }
        });
      } else if (typeof currentEntry == "number") {
        finalOutput.push(currentEntry);
      } else if (typeof currentEntry == "string") {
        finalOutput.push(
          currentEntry[0].toLocaleUpperCase() + currentEntry.slice(1)
        );
      } else if (Array.isArray(currentEntry)) {
        currentEntry.forEach((entry: string) =>
          finalOutput.push(entry[0].toLocaleUpperCase() + entry.slice(1) + " ")
        );
      }
      if (columnIndex < columnRange[1]) finalOutput.push(`\t`);
    }
    if (rowIndex < rowRange[1]) finalOutput.push(`\n`);
  }
  return finalOutput.join("");
}
