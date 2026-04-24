import { UpdateAgi, UpdateBod, UpdateCha, UpdateInt, UpdateLog, UpdateWil } from "../update functions/update-attributes";
import { SheetOpened } from "../update functions/update-distributers";

// Event Listeners for attribute changes
on("change:agility", UpdateAgi);
on("change:body", UpdateBod);
on("change:charisma", UpdateCha);
on("change:intuition", UpdateInt);
on("change:logic", UpdateLog);
on("change:willpower", UpdateWil);
on("sheet:opened", SheetOpened);