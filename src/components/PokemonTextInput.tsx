import getPokemonByName from "@/utils/pokemonFetcher";
import type { Pokemon } from "pokeapi-js-wrapper";
import { useState, type Dispatch, type SetStateAction } from "react";

interface IPokemonTextInputProps {
  setPokemonList: Dispatch<SetStateAction<Partial<Pokemon>[]>>;
}

export function PokemonTextInput({ setPokemonList }: IPokemonTextInputProps) {
  const [pokemonTextArea, setPokemonTextArea] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        (async () => {
          setPokemonList(await getPokemonByName(pokemonTextArea));
        })();
      }}
    >
      <textarea
        value={pokemonTextArea}
        onChange={(event) => setPokemonTextArea(event.target.value)}
      ></textarea>
      <button type="submit">Submit</button>
    </form>
  );
}
