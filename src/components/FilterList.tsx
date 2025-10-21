import { switchOutMoves } from "@/data/moveCategories";
import type { ColumnFilter } from "@tanstack/react-table";
import { type Dispatch, type SetStateAction } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { changeInclusion } from "@/utils/moveInclusionHelpers";

interface IFilterListProps {
  nameFilter: ColumnFilter[];
  setNameFilter: Dispatch<SetStateAction<ColumnFilter[]>>;
}

export type moveGroupsDef = {
  groupName: string;
  moves: string[];
}[];

export type moveGroupFilter = {
  groupName: string;
  moves: {
    name: string;
    inclusion: true | false | "indeterminate";
  }[];
};

const moveGroups = [
  { groupName: "Pivots", moves: switchOutMoves },
  { groupName: "Switches2", moves: switchOutMoves },
] as moveGroupsDef;

export function FilterList({ nameFilter, setNameFilter }: IFilterListProps) {
  function getMoveInclusion(moveName: string, moveGroup: string) {
    const movesInFilter = (
      nameFilter?.find((filter) => filter.id === "moves")
        ?.value as moveGroupFilter[]
    )?.find((moveFilter) => moveFilter.groupName === moveGroup)?.moves;
    // There is no filter
    if (!movesInFilter) return false;
    return movesInFilter.find((moveF) => moveF.name === moveName)?.inclusion;
  }

  function updateMoveInclusion(moveName: string, groupName: string) {
    // Check if the filters exists
    const movesFilter = nameFilter?.find((filter) => filter.id === "moves");
    const groupFilter = (movesFilter?.value as moveGroupFilter[])?.find(
      (moveGroup) => moveGroup.groupName === groupName
    );
    let newFilter = [] as ColumnFilter[];
    if (!movesFilter || !groupFilter) {
      // Create a moves filter if it doesn't exist
      newFilter = [
        ...nameFilter.filter((filter) => filter.id !== "moves"),
        {
          id: "moves",
          value: [
            ...((movesFilter?.value || []) as moveGroupFilter[]),
            {
              // ...moveGroups.map((groupName) => ({
              //     groupName: groupName,
              //     moves: groupName.moves,
              //   })),
              // ,
              groupName: groupName,
              moves: moveGroups
                .find((moveGroup) => moveGroup.groupName === groupName)
                ?.moves.map((move) => ({ name: move, inclusion: false })),
              // moves: moveGroups.map((move) => ({
              //   name: move,
              //   inclusion: false,
              // })),
            },
          ] as moveGroupFilter[],
        },
      ];
    } else {
      newFilter = [...nameFilter];
    }

    const newMovesFilter = newFilter.find((filter) => filter.id === "moves");

    let newGroupFilter = (newMovesFilter?.value as moveGroupFilter[]).find(
      (moveGroup) => moveGroup.groupName === groupName
    );
    const newInclusion = newGroupFilter!.moves.find(
      (move) => move.name === moveName
    )!.inclusion;
    newGroupFilter = {
      groupName: groupName,
      moves:
        newGroupFilter?.moves
          .filter((move) => move.name !== moveName)
          .concat({
            name: moveName,
            inclusion: changeInclusion(newInclusion),
          }) || [],
    };

    const finalMoves = (newMovesFilter?.value as moveGroupFilter[])
      .filter((moveFilter) => moveFilter.groupName !== groupName)
      .concat(newGroupFilter);

    setNameFilter([
      ...newFilter.filter((filter) => filter.id !== "moves"),
      { id: "moves", value: finalMoves },
    ]);
  }

  return (
    <>
      {moveGroups.map((moveGroup) =>
        moveGroup.moves.map((move) => (
          <Label>
            <Checkbox
              checked={getMoveInclusion(move, moveGroup.groupName)}
              onClick={() => updateMoveInclusion(move, moveGroup.groupName)}
            />
            {move}
          </Label>
        ))
      )}
    </>
  );
}
