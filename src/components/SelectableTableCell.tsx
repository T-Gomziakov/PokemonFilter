import React, {
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import { TableCell } from "./ui/table";
import { cn } from "@/lib/utils";
import type { SelectedCells } from "@/utils/typings";
import { isCellSelected } from "@/utils/selectedCellHelpers";

type SelectableTableCellProps = {
  children: React.ReactNode;
  className: string;
  row: number;
  column: number;
  selectedCells: SelectedCells;
  setSelectedCells: Dispatch<SetStateAction<SelectedCells>>;
};

function SelectableTableCell(props: SelectableTableCellProps) {
  const isSelected = isCellSelected(
    props.selectedCells,
    props.row,
    props.column
  );
  return (
    <TableCell
      className={cn(
        props.className,
        "select-none",
        isSelected ? "bg-teal-100" : ""
      )}
      onClick={(event: MouseEvent) => {
        if (event.button == 0 && event.shiftKey) {
          props.setSelectedCells({
            ...props.selectedCells,
            lastCell: [props.row, props.column],
          });
        } else if (event.button == 0) {
          props.setSelectedCells({
            firstCell: [props.row, props.column],
            lastCell: [null, null],
          });
        }
      }}
    >
      {props.children}
    </TableCell>
  );
}

export default SelectableTableCell;
