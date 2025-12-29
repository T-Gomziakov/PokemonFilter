/**  Whether a move is filtered or not.
 *
 *
 * True - all true moves are included.
 *
 * "indeterminate" - at least 1 indeterminate move is included.
 *
 * false - we don't care if the move is included or not
 */ export type Inclusion = boolean | "indeterminate";

/**  This object is stored within a ColumnFilter and is used to filter moves column
 */
export type MovesFilter = {
  id: "moves";
  value: GroupOfMoves[];
};

/** This object represents a group of moves and whether they are included in the filtering process
 */
export type GroupOfMoves = {
  groupName: string;
  moves: {
    name: string;
    inclusion: Inclusion;
  }[];
};

export type SelectedCells = {
  firstCell: [number | null, number | null];
  lastCell: [number | null, number | null];
};
