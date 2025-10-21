import { Pokedex, type Pokemon } from "pokeapi-js-wrapper";
/**
 * A function that takes a string of pokemon names and returns objects queried from the pokemon API
 *

 * @param pokemonList String containing pokemon names, each separated by \n
 * @returns A promise to an array of Pokemon objects
 */
//TODO: Better parsing from names(autocomplete) + don't re-fetch data we already have
export default async function getPokemonByName(
  pokemonList: string
): Promise<Array<Pokemon>> {
  const parsedPokemonList = pokemonList.split("\n");
  const P = new Pokedex();
  const retrievedList = await Promise.allSettled(
    parsedPokemonList.map(async (pokemon) => {
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
