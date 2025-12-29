import type { SelectedCells } from "./typings";

export function checkRangeExists(selectedCells: SelectedCells): boolean {
  return (
    selectedCells.firstCell[0] !== null &&
    selectedCells.firstCell[1] !== null &&
    selectedCells.lastCell[0] !== null &&
    selectedCells.lastCell[1] !== null
  );
}

export function getRowRange(selectedCells: SelectedCells): [number, number] {
  return [
    Math.min(
      selectedCells.firstCell[0]!,
      selectedCells.lastCell[0] !== null
        ? selectedCells.lastCell[0]
        : selectedCells.firstCell[0]!
    ),
    Math.max(
      selectedCells.firstCell[0]!,
      selectedCells.lastCell[0] !== null
        ? selectedCells.lastCell[0]
        : selectedCells.firstCell[0]!
    ),
  ];
}

export function getColumnRange(selectedCells: SelectedCells): [number, number] {
  return [
    Math.min(
      selectedCells.firstCell[1]!,
      selectedCells.lastCell[1] !== null
        ? selectedCells.lastCell[1]
        : selectedCells.firstCell[1]!
    ),
    Math.max(
      selectedCells.firstCell[1]!,
      selectedCells.lastCell[1] !== null
        ? selectedCells.lastCell[1]
        : selectedCells.firstCell[1]!
    ),
  ];
}

export function isCellSelected(
  selectedCells: SelectedCells,
  row: number,
  column: number
): boolean {
  // check if we have a range (first and last cells)
  if (checkRangeExists(selectedCells)) {
    const rowRange = getRowRange(selectedCells);
    const columnRange = getColumnRange(selectedCells);
    return (
      row >= rowRange[0] &&
      row <= rowRange[1] &&
      column >= columnRange[0] &&
      column <= columnRange[1]
    );
  } else if (
    selectedCells.firstCell[0] !== null &&
    selectedCells.firstCell[1] !== null
  ) {
    return (
      row === selectedCells.firstCell[0] &&
      column === selectedCells.firstCell[1]
    );
  }
  return false;
}

export function resetSelectedCells(): SelectedCells {
  return { firstCell: [null, null], lastCell: [null, null] };
}
