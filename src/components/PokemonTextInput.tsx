/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Pokemon } from "pokeapi-js-wrapper";
import {
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";

interface IPokemonTextInputProps {
  setPokemonList: Dispatch<SetStateAction<Partial<Pokemon>[]>>;
}

export function PokemonTextInput({ setPokemonList }: IPokemonTextInputProps) {
  const [pokemonTextArea, setPokemonTextArea] = useState("");
  function handlePokemonChange(event: FormEvent) {
    event.preventDefault();
  }
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Label
          htmlFor="data-input"
          className="mb-2 grid grid-cols-3 place-items-center"
        >
          <p className="col-end-3">Custom Pokemon List</p>
          <Button
            variant={"ghost"}
            size={"icon-lg"}
            className="place-self-start"
          >
            <ChevronDown />
          </Button>
        </Label>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <form className="mb-8">
          <Textarea
            id="data-input"
            placeholder="e.g., Pikachu, Charizard, etc"
            value={pokemonTextArea}
            onChange={(e) => handlePokemonChange(e)}
            className="mb-3"
            rows={3}
          />
        </form>
      </CollapsibleContent>
    </Collapsible>
  );
}
