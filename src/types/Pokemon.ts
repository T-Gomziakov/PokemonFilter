export type PokemonType =
  | "Normal"
  | "Fire"
  | "Water"
  | "Grass"
  | "Electric"
  | "Ice"
  | "Fighting"
  | "Poison"
  | "Ground"
  | "Flying"
  | "Psychic"
  | "Bug"
  | "Rock"
  | "Ghost"
  | "Dragon"
  | "Dark"
  | "Steel"
  | "Fairy";

export interface Pokemon {
  name: string;
  type: [PokemonType, PokemonType?];
  ability: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    spatk: number;
    spdef: number;
    speed: number;
  };
}
