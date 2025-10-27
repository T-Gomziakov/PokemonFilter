import { Pokedex, type Pokemon } from "pokeapi-js-wrapper";
/**
 * A function that takes a string of pokemon names and returns objects queried from the pokemon API
 *

 * @param pokemonList Text written by the user. Should be a string if unparsed; should be an array with each entry containing legal pokemon name if parsed
 * @returns A promise to an array of Pokemon objects
 */
//TODO: Better parsing from names(autocomplete) + don't re-fetch data we already have
export async function getPokemonByName(
  pokemonList: string | string[]
): Promise<Array<Pokemon>> {
  if (!Array.isArray(pokemonList)) {
    pokemonList = parsePokemonList(pokemonList);
  }
  const P = new Pokedex();
  const retrievedList = await Promise.allSettled(
    pokemonList.map(async (pokemon) => {
      return P.getPokemonByName(pokemon);
    })
  );
  const convertedList = retrievedList.reduce((finalList, currentPromise) => {
    if (currentPromise.status == "fulfilled") {
      finalList.push(currentPromise.value);
    }
    return finalList;
  }, [] as Pokemon[]);

  return convertedList;
}

/** Parses the list of names to give an array of legal pokemon names */
export function parsePokemonList(pokemonList: string): string[] {
  return pokemonList.toLowerCase().replace(",", "\n").split("\n");
}

export async function getAllPokemonNames() {
  localStorage.getItem("pokemonNames");
  const pokemonList = (await (
    await fetch("https://pokeapi.co/api/v2/pokemon?limit=-1")
  ).json()) as Array<{ name: string; url: string }>;
  const parsedPokemonList = pokemonList.map(
    (pokemonEntry) => pokemonEntry.name
  );
  return parsedPokemonList;
}
