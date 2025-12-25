import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

import { X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Separator } from "./ui/separator";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "./ui/button";
import type { ColumnFilter } from "@tanstack/react-table";
import {
  advanceGroupInclusion,
  advanceMoveInclusion,
  getCurrentGroupState,
  getGroupInclusion,
  getMoveInclusion,
  resetAllGroupInclusions,
} from "@/utils/filterHelpers";

interface FilterListProps {
  tableFilter: ColumnFilter[];
  setTableFilter: Dispatch<SetStateAction<ColumnFilter[]>>;
}

function FilterList({ tableFilter, setTableFilter }: FilterListProps) {
  const [moveGroups] = useState(getCurrentGroupState(tableFilter));

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
            onClick={() => setTableFilter(resetAllGroupInclusions(tableFilter))}
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
                    checked={getGroupInclusion(
                      tableFilter,
                      moveGroup.groupName
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTableFilter(
                        advanceGroupInclusion(tableFilter, moveGroup.groupName)
                      );
                    }}
                  />
                  <AccordionTrigger className="flex px-2">
                    <p className="flex-1">{moveGroup.groupName}</p>
                  </AccordionTrigger>
                </div>
                <AccordionContent>
                  {moveGroup.moves.map((move) => (
                    <div key={moveGroup.groupName + move.name} className="py-1">
                      <Label className="flex p-2">
                        <Checkbox
                          checked={getMoveInclusion(
                            tableFilter,
                            moveGroup.groupName,
                            move.name
                          )}
                          onClick={() =>
                            setTableFilter(
                              advanceMoveInclusion(
                                tableFilter,
                                moveGroup.groupName,
                                move.name
                              )
                            )
                          }
                        />
                        {move.name}
                      </Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </div>
    </>
  );
}

export default FilterList;
