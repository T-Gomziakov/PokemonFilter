import { useState } from "react";
import type { Pokemon } from "pokeapi-js-wrapper";
import type { ColumnFilter } from "@tanstack/react-table";

import { PokemonTextInput } from "@/components/PokemonTextInput";
import { PokemonTable } from "@/components/PokemonTable";
import { FilterList } from "@/components/FilterList";

function App() {
  const [pokemonList, setPokemonList] = useState<Partial<Pokemon>[]>([]);
  const [nameFilter, setNameFilter] = useState<ColumnFilter[]>([]);
  return (
    <>
      <div id="container" className="max-w-5xl mx-auto mt-8 overflow-auto">
        <PokemonTextInput setPokemonList={setPokemonList} />
        <FilterList nameFilter={nameFilter} setNameFilter={setNameFilter} />
        <PokemonTable pokemonList={pokemonList} columnFilters={nameFilter} />
      </div>
    </>
  );
}

export default App;
