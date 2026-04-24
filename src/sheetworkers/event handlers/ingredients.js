import { UpdateEssence } from "../update functions/update-distributers";
import { UpdateLoad } from "../update functions/update-inventory";

on("change:essence_fire", UpdateLoad);
on("change:essence_water", UpdateLoad);
on("change:essence_earth", UpdateLoad);
on("change:essence_air", UpdateLoad);

on("change:essence_air", UpdateEssence);
on("change:essence_fire", UpdateEssence);
on("change:essence_earth", UpdateEssence);
on("change:essence_water", UpdateEssence);

on("change:bolts", UpdateLoad);
on("change:plates", UpdateLoad);
on("change:wires", UpdateLoad);
on("change:cogs", UpdateLoad);
on("change:rods", UpdateLoad);
on("change:lenses", UpdateLoad);
on("change:gunpowder", UpdateLoad);