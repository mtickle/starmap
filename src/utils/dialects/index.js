// utils/dialects/index.js
import { botanicalDialect } from "./botanical.js";
import { cosmicDialect } from "./cosmic.js";
import { faunaDialect } from "./fauna.js";

export const DIALECTS = {
  cosmic: cosmicDialect,
  botanical: botanicalDialect,
  fauna: faunaDialect,
};

export const ENTITY_ROUTER = {
  star: "cosmic",
  moon: "cosmic",
  flora: "botanical",
  species_rocky: "fauna",
  "species_ice world": "fauna",
  species_volcanic: "fauna",
};
