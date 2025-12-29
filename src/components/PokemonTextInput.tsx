/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  getAllPokemonNames,
  parsePokemonList,
} from "@/utils/pokemonAPIHelpers";
import { TableContext } from "@/context/TableContext";

export function PokemonTextInput() {
  const tableContext = useContext(TableContext);

  const [pokemonText, setPokemonText] = useState("");
  const [legalPokemonNames, setLegalPokemonNames] = useState<string[] | null>(
    null
  );

  useEffect(() => {
    (async () => {
      setLegalPokemonNames(await getAllPokemonNames());
    })();
  }, []);

  function onPokemonTextSubmit() {
    (async () => {
      const parsedList = await parsePokemonList(pokemonText);
      tableContext?.setTableFilter((prev) => {
        const oldFilter = [...prev].filter((f) => f.id !== "name");
        return oldFilter.concat({ id: "name", value: parsedList });
      });
    })();
  }

  function clearPokemonText() {
    tableContext?.setTableFilter([]);
    setPokemonText("");
  }

  return (
    <div className="px-4 py-4">
      {/* // <Collapsible open={true}> */}
      {/* // <CollapsibleTrigger asChild> */}
      <Label
        htmlFor="data-input"
        className="mb-2 grid grid-cols-3 place-items-center"
      >
        <h1 className="col-end-3 font-bold">Custom Pokemon List</h1>
        {/* <Button
            variant={"ghost"}
            size={"icon-lg"}
            className="place-self-start"
          >
            <ChevronDown />
          </Button> */}
      </Label>
      {/* </CollapsibleTrigger> */}
      {/* // <CollapsibleContent> */}
      <form className="">
        <Textarea
          id="data-input"
          placeholder="e.g., Pikachu, Charizard, etc"
          value={pokemonText}
          onChange={(e) => setPokemonText(e.target.value)}
          className=""
          rows={3}
        />
      </form>
      <Button onClick={onPokemonTextSubmit}>Filter</Button>
      <Button onClick={clearPokemonText}>Clear</Button>
      {/* </CollapsibleContent> */}
      {/* </Collapsible> */}
    </div>
  );
}
