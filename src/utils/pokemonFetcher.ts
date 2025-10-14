import { Pokedex, type Pokemon } from "pokeapi-js-wrapper";
/**
 * A function that takes a string of pokemon names and returns objects queried from the pokemon API
 *
 * TODO: Better parsing from names
 * @param pokemonList Just a string of pokemon names
 * @returns A promise to an array of Pokemon objects
 */
export default async function GetPokemonData(
  pokemonList: string[]
): Promise<Array<Pokemon | undefined>> {
  const P = new Pokedex();
  const retrievedList = await Promise.allSettled(
    pokemonList.map(async (pokemon) => {
      return P.getPokemonByName(pokemon);
    })
  );
  const convertedList = retrievedList.map((value) => {
    if (value.status == "fulfilled") {
      return value.value;
    }
    return undefined;
  });
  return convertedList;
}
