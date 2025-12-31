import { getAllPokemonNames } from "./pokemonAPIHelpers";

/** Parses the list of names to give an array of distinct, legal pokemon names
 *
 * @returns an array of strings, where each string is in a format of: all lower case, no spaces (replaced with dashes(-))
 *
 * Ex. "Pikachu \n Charizard" -> ["pikachu", "charizard"]
 */
export async function parseRawPokemonNames(
  pokemonList: string
): Promise<string[]> {
  let newList = pokemonList.toLowerCase().replace(",", "\n").split("\n");

  newList = newList.map((pokemonEntry) => {
    const formattedEntry = pokemonEntry.trim().replace(" ", "-");
    if (formattedEntry.slice(-2) === "-h") {
      return formattedEntry.slice(0, -2) + "-hisui";
    }
    if (formattedEntry.slice(-2) === "-a") {
      return formattedEntry.slice(0, -2) + "-alola";
    }
    if (formattedEntry.slice(-2) === "-g") {
      return formattedEntry.slice(0, -2) + "-galar";
    }
    return formattedEntry;
  });

  const legalPokemonNames = await getAllPokemonNames();
  newList = newList.filter((pokemonName) =>
    legalPokemonNames.includes(pokemonName)
  );
  newList = [...new Set(newList)];
  return newList;
}
