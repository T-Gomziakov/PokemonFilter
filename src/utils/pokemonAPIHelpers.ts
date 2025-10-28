import { Pokedex, type Pokemon } from "pokeapi-js-wrapper";
/**
 * A function that takes a string of pokemon names and returns objects queried from the pokemon API
 *

 * @param pokemonList Text written by the user. Should be a string if unparsed; should be an array with each entry containing legal pokemon name if parsed
 * @returns A promise to an array of Pokemon objects
 */
export async function getPokemonByName(
  pokemonList: string | string[]
): Promise<Array<Pokemon>> {
  if (!Array.isArray(pokemonList)) {
    pokemonList = await parsePokemonList(pokemonList);
  }
  let storedPokemonList = [] as string[];
  pokemonList = pokemonList.reduce((finalPokemonList, currentPokemonName) => {
    if (localStorage.getItem(currentPokemonName)) {
      continue;
    } else {
    }
  });

  // const P = new Pokedex();
  // const retrievedList = await Promise.allSettled(
  //   pokemonList.map(async (pokemon) => {
  //     return P.getPokemonByName(pokemon);
  //   })
  // );
  // const convertedList = retrievedList.reduce((finalList, currentPromise) => {
  //   if (currentPromise.status == "fulfilled") {
  //     finalList.push(currentPromise.value);
  //   }
  //   return finalList;
  // }, [] as Pokemon[]);

  return convertedList;
}

/** Parses the list of names to give an array of legal pokemon names */
export async function parsePokemonList(pokemonList: string): Promise<string[]> {
  let newList = pokemonList.toLowerCase().replace(",", "\n").split("\n");
  const legalPokemonNames = await getAllPokemonNames();
  newList = newList.filter((pokemonName) =>
    legalPokemonNames.includes(pokemonName)
  );
  return newList;
}

export async function getAllPokemonNames(): Promise<string[]> {
  if (localStorage.getItem("pokemonNames")) {
    return JSON.parse(localStorage.getItem("pokemonNames")!);
  }
  const pokemonList = (
    await (await fetch("https://pokeapi.co/api/v2/pokemon?limit=-1")).json()
  ).results as Array<{ name: string; url: string }>;
  console.log(pokemonList);
  const parsedPokemonList = pokemonList.map(
    (pokemonEntry) => pokemonEntry.name
  );
  // Store the retrieved pokemon in localstorage
  localStorage.setItem("pokemonNames", JSON.stringify(parsedPokemonList));
  return parsedPokemonList;
}
