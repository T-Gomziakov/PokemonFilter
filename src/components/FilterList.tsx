import * as moveCategories from "@/data/moveCategories";
import type { ColumnFilter } from "@tanstack/react-table";
import { useCallback, type Dispatch, type SetStateAction } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { changeInclusion } from "@/utils/moveInclusionHelpers";
import { Item, ItemContent, ItemHeader } from "./ui/item";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

interface FilterListProps {
  nameFilter: ColumnFilter[];
  setNameFilter: Dispatch<SetStateAction<ColumnFilter[]>>;
}

export type MoveGroupsDef = {
  groupName: string;
  moves: string[];
}[];

export type MoveGroupsFilter = {
  groupName: string;
  moves: {
    name: string;
    inclusion: true | false | "indeterminate";
  }[];
};

const moveGroups = Object.values(moveCategories).map((category) => ({
  groupName: category.groupName,
  moves: category.moves,
})) as MoveGroupsDef;

export function FilterList({ nameFilter, setNameFilter }: FilterListProps) {
  const getGroupInclusion = useCallback(() => {
    return moveGroups.map((moveGroup) => ({
      groupName: moveGroup.groupName,
      getInclusion: () => {
        const moveGroupFilters = nameFilter.find(
          (filter) => filter.id === "moves"
        )?.value as MoveGroupsFilter[];
        const moves = moveGroupFilters?.find(
          (moveGroupFilter) => moveGroupFilter.groupName === moveGroup.groupName
        )?.moves;
        if (!moves?.length) return false;
        // Check if no move is selected
        const falseCheck = moves.every((move) => move.inclusion === false);
        if (falseCheck) return false;
        // Check if all moves are selected
        const trueCheck = moves.every((move) => move.inclusion === true);
        if (trueCheck) return true;
        // Check if at least 1 move is selected
        const partialCheck = moves.some(
          (move) =>
            move.inclusion === true || move.inclusion === "indeterminate"
        );
        if (partialCheck) return "indeterminate";
        return false;
      },
    }));
  }, [nameFilter]);

  function updateGroupInclusion(groupName: string) {
    // Check if the filters exists
    const movesFilter = nameFilter?.find((filter) => filter.id === "moves");
    const groupFilter = (movesFilter?.value as MoveGroupsFilter[])?.find(
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
            ...((movesFilter?.value || []) as MoveGroupsFilter[]),
            {
              groupName: groupName,
              moves: moveGroups
                .find((moveGroup) => moveGroup.groupName === groupName)
                ?.moves.map((move) => ({
                  name: move,
                  inclusion: "indeterminate",
                })),
            },
          ] as MoveGroupsFilter[],
        },
      ];
      setNameFilter(newFilter);
      return;
    } else {
      newFilter = [...nameFilter];
      const groupInclusion = getGroupInclusion()
        .find((group) => group.groupName === groupName)
        ?.getInclusion();

      let newMoveGroupsFilter = newFilter.find(
        (filter) => filter.id === "moves"
      )?.value as MoveGroupsFilter[];

      let moves = newMoveGroupsFilter.find(
        (moveGroup) => moveGroup.groupName === groupName
      )?.moves;

      if (groupInclusion === true) {
        moves = moves?.map((move) => ({ name: move.name, inclusion: false }));
      } else if (groupInclusion === false) {
        moves = moves?.map((move) => ({
          name: move.name,
          inclusion: "indeterminate",
        }));
      } else if (groupInclusion === "indeterminate") {
        // If every move is already selected, set all of them to true
        if (
          moves?.every(
            (move) =>
              move.inclusion === true || move.inclusion === "indeterminate"
          )
        ) {
          moves = moves?.map((move) => ({ name: move.name, inclusion: true }));
        }
        // Otherwise, select all unselected moves
        else {
          moves = moves?.map((move) => ({
            name: move.name,
            inclusion: move.inclusion === true ? true : "indeterminate",
          }));
        }
      }

      newMoveGroupsFilter = newMoveGroupsFilter
        .filter((moveGroupsFilter) => moveGroupsFilter.groupName !== groupName)
        .concat([{ groupName: groupName, moves: moves || [] }]);

      newFilter = newFilter
        .filter((filter) => filter.id !== "moves")
        .concat({ id: "moves", value: newMoveGroupsFilter });
      setNameFilter(newFilter);
    }
  }

  function getMoveInclusion(moveName: string, moveGroup: string) {
    const movesInFilter = (
      nameFilter?.find((filter) => filter.id === "moves")
        ?.value as MoveGroupsFilter[]
    )?.find((moveFilter) => moveFilter.groupName === moveGroup)?.moves;
    // There is no filter
    if (!movesInFilter?.length) return false;
    return movesInFilter.find((moveFilter) => moveFilter.name === moveName)
      ?.inclusion;
  }

  function updateMoveInclusion(moveName: string, groupName: string) {
    // Check if the filters exists
    const movesFilter = nameFilter?.find((filter) => filter.id === "moves");
    const groupFilter = (movesFilter?.value as MoveGroupsFilter[])?.find(
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
            ...((movesFilter?.value || []) as MoveGroupsFilter[]),
            {
              groupName: groupName,
              moves: moveGroups
                .find((moveGroup) => moveGroup.groupName === groupName)
                ?.moves.map((move) => ({ name: move, inclusion: false })),
            },
          ] as MoveGroupsFilter[],
        },
      ];
    } else {
      newFilter = [...nameFilter];
    }

    const newMovesFilter = newFilter.find((filter) => filter.id === "moves");

    let newGroupFilter = (newMovesFilter?.value as MoveGroupsFilter[]).find(
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

    const finalMoves = (newMovesFilter?.value as MoveGroupsFilter[])
      .filter((moveFilter) => moveFilter.groupName !== groupName)
      .concat(newGroupFilter);

    setNameFilter([
      ...newFilter.filter((filter) => filter.id !== "moves"),
      { id: "moves", value: finalMoves },
    ]);
  }
  return (
    <>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 mx-2 px-0 mb-6 gap-6">
        <h1 className="col-span-full justify-self-center text-lg font-bold mt-6 mb-0">
          Move Filters
        </h1>
        {moveGroups.map((moveGroup) => {
          return (
            <Collapsible
              className="outline-1 w-64 rounded-2xl justify-self-center h-min "
              key={moveGroup.groupName}
            >
              <Item className="p-2">
                <ItemHeader>
                  <Label className="text-lg0 w-full">
                    <Checkbox
                      checked={getGroupInclusion()
                        .find(
                          (group) => group.groupName === moveGroup.groupName
                        )
                        ?.getInclusion()}
                      onClick={() => updateGroupInclusion(moveGroup.groupName)}
                      className="size-6"
                    />

                    {moveGroup.groupName}
                  </Label>
                  <CollapsibleTrigger asChild>
                    <Button variant={"secondary"} size={"icon-lg"}>
                      <ChevronDown />
                    </Button>
                  </CollapsibleTrigger>
                </ItemHeader>
              </Item>
              <CollapsibleContent>
                <Item className="pt-0 pl-6">
                  <ItemContent>
                    <ul>
                      {moveGroup.moves.map((move) => (
                        <li key={moveGroup.groupName + move}>
                          <Label>
                            {" "}
                            <Checkbox
                              checked={getMoveInclusion(
                                move,
                                moveGroup.groupName
                              )}
                              onClick={() =>
                                updateMoveInclusion(move, moveGroup.groupName)
                              }
                            />
                            {move}
                          </Label>
                        </li>
                      ))}
                    </ul>
                  </ItemContent>
                </Item>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
        <Button className="col-span-full w-32 place-self-center">Submit</Button>
      </div>
    </>
  );
}
