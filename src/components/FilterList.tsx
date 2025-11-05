import * as moveCategories from "@/data/moveCategories";
import type { ColumnFilter } from "@tanstack/react-table";
import {
  useCallback,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";
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
import { ChevronDown, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Separator } from "./ui/separator";

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
  const getGroupInclusion = useMemo(() => {
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
      const groupInclusion = getGroupInclusion
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
          moves = moves?.map((move) => ({ name: move.name, inclusion: false }));
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

  function resetAllInclusion() {
    // Check if the filters exists
    const movesFilter = nameFilter?.find((filter) => filter.id === "moves");
    if (!movesFilter) return;
    let newFilter = [...nameFilter];
    let newMoveGroupsFilter = movesFilter.value as MoveGroupsFilter[];

    newMoveGroupsFilter = newMoveGroupsFilter.map((moveGroup) => ({
      groupName: moveGroup.groupName,
      moves: moveGroup.moves.map((move) => ({
        name: move.name,
        inclusion: false,
      })),
    }));

    newFilter = newFilter
      .filter((filter) => filter.id !== "moves")
      .concat({ id: "moves", value: newMoveGroupsFilter });
    setNameFilter(newFilter);
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
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Filter by Moves</h2>
            <p className="text-gray-500 text-sm">
              Click on moves to filter Pokémon that can learn them
            </p>
          </div>
          <Button
            variant={"ghost"}
            className="hover:bg-gray-200 border-y-1 border-gray-200"
            onClick={() => resetAllInclusion()}
          >
            <X />
            <Separator orientation={"vertical"} />
            Clear All
          </Button>
        </div>
        <ScrollArea className="h-48">
          <Accordion
            type="single"
            collapsible
            className="grid lg:grid-cols-3 md:grid-cols-2 px-0 gap-6"
          >
            {moveGroups.map((moveGroup) => (
              <AccordionItem
                key={moveGroup.groupName}
                value={moveGroup.groupName}
              >
                <div className="flex flex-row">
                  <Checkbox
                    className="my-auto mx-2 size-6"
                    checked={getGroupInclusion
                      .find((group) => group.groupName === moveGroup.groupName)
                      ?.getInclusion()}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateGroupInclusion(moveGroup.groupName);
                    }}
                  />
                  <AccordionTrigger className="flex px-2">
                    <p className="flex-1">{moveGroup.groupName}</p>
                  </AccordionTrigger>
                </div>
                <AccordionContent>
                  {moveGroup.moves.map((move) => (
                    <div key={moveGroup.groupName + move} className="py-1">
                      <Label className="flex p-2">
                        <Checkbox
                          checked={getMoveInclusion(move, moveGroup.groupName)}
                          onClick={() =>
                            updateMoveInclusion(move, moveGroup.groupName)
                          }
                        />
                        {move}
                      </Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </div>
      {/* <div className="grid lg:grid-cols-3 md:grid-cols-2 px-0 mb-6 gap-6">
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
      </div> */}
    </>
  );
}
