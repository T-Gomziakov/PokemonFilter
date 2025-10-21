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
      <main>
        <PokemonTextInput setPokemonList={setPokemonList} />
        <FilterList nameFilter={nameFilter} setNameFilter={setNameFilter} />
        <PokemonTable pokemonList={pokemonList} columnFilters={nameFilter} />
      </main>
    </>
  );
}

export default App;
