import { UpdateBlessing, UpdateMaxMemorisedBlessings, UpdateMemorisedBlessings } from "../update functions/magic/update-blessings";

on("change:repeating_blessing:blessing_name", UpdateBlessing);
on("change:repeating_blessing:blessing_faith", UpdateBlessing);
on("change:repeating_blessing:blessing_memorised", UpdateMaxMemorisedBlessings);
on("remove:repeating_blessing", UpdateMemorisedBlessings);