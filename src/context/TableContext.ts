import type { ColumnFilter } from "@tanstack/react-table";
import type { Pokemon } from "pokeapi-js-wrapper";
import { createContext, type Dispatch, type SetStateAction } from "react";

type tableContextType = {
  pokemonList: Partial<Pokemon>[];
  setPokemonList: Dispatch<SetStateAction<Partial<Pokemon>[]>>;
  tableFilter: ColumnFilter[];
  setTableFilter: Dispatch<SetStateAction<ColumnFilter[]>>;
};

export const TableContext = createContext<tableContextType | null>(null);
