import { useEffect, useState } from "react";
import { type Pokemon } from "pokeapi-js-wrapper";
import type { ColumnFilter } from "@tanstack/react-table";

import { PokemonTable } from "@/components/PokemonTable";
import { getAllPokemon } from "./utils/pokemonAPIHelpers";

import { getDefaultTableFilter } from "./utils/dataGetters";
import FilterList from "./components/FilterList";

import { ToastContainer } from "react-toastify";
import SidebarMenu from "./components/SidebarMenu";

import { TableContext } from "./context/TableContext";
function App() {
  const [pokemonList, setPokemonList] = useState<Partial<Pokemon>[]>([]);
  const [tableFilter, setTableFilter] = useState<ColumnFilter[]>(
    getDefaultTableFilter()
  );

  // Have to use a useEffect since data fetching is async
  useEffect(() => {
    (async () => {
      setPokemonList(await getAllPokemon());
    })();
  }, []);

  return (
    <>
      <TableContext
        value={{
          pokemonList: pokemonList,
          setPokemonList: setPokemonList,
          tableFilter: tableFilter,
          setTableFilter: setTableFilter,
        }}
      >
        <ToastContainer />
        <SidebarMenu />
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-blue-600 text-2xl font-semibold">
            Pokemon Filtering Tool
          </h1>
          <p className="text-gray-600 text-xl">
            Comprehensive stats and move-set filtering
          </p>
        </div>
        <FilterList tableFilter={tableFilter} setTableFilter={setTableFilter} />
        <PokemonTable pokemonList={pokemonList} columnFilters={tableFilter} />
      </TableContext>
    </>
  );
}

export default App;
