import { Pokedex, type Pokemon } from "pokeapi-js-wrapper";
/**

 * @returns A promise to an array of Pokemon objects
 */
export async function getAllPokemon(): Promise<Array<Pokemon>> {
  const P = new Pokedex();
  const pokemonNamesList = await getAllPokemonNames();

  const retrievedList = await Promise.allSettled(
    pokemonNamesList.map(async (pokemon) => {
      return P.getPokemonByName(pokemon);
    })
  );

  const fulfilledList = retrievedList.reduce((finalList, currentPromise) => {
    if (currentPromise.status == "fulfilled") {
      finalList.push(currentPromise.value);
    }
    return finalList;
  }, [] as Pokemon[]);
  return fulfilledList;
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
  return (await new Pokedex().getPokemonsList()).results.map(
    (entry) => entry.name
  );
}
