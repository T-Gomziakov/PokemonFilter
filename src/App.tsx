import { useEffect, useState } from "react";
import { type Pokemon } from "pokeapi-js-wrapper";
import type { ColumnFilter } from "@tanstack/react-table";

import { PokemonTable } from "@/components/PokemonTable";
import { getAllPokemon } from "./utils/pokemonAPIHelpers";
import { FilterList } from "./components/FilterList";

function App() {
  const [pokemonList, setPokemonList] = useState<Partial<Pokemon>[]>([]);
  const [nameFilter, setNameFilter] = useState<ColumnFilter[]>([]);

  useEffect(() => {
    (async () => {
      setPokemonList(await getAllPokemon());
    })();
  }, []);

  return (
    <>
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-blue-600 text-2xl font-semibold">
          Pokemon Filtering Tool
        </h1>
        <p className="text-gray-600 text-xl">
          Comprehensive stats and move-set filtering
        </p>
      </div>
      <FilterList nameFilter={nameFilter} setNameFilter={setNameFilter} />
      <PokemonTable pokemonList={pokemonList} columnFilters={nameFilter} />
    </>
  );
}

export default App;
