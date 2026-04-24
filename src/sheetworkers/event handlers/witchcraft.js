import { InvokeBlessing } from "../update functions/magic/update-blessings";
import { UpdateCurse } from "../update functions/magic/update-curses";
import { BrewPotion, UpdatePotion } from "../update functions/magic/update-potions";
import { PerformRitual, UpdateRitual } from "../update functions/magic/update-rituals";
import { CarveRune, UpdateRune } from "../update functions/magic/update-runes";
import { CastSpell, UpdateMaxMemorisedSpells, UpdateMemorisedSpells, UpdateSpell, UpdateSpellSaveDT } from "../update functions/magic/update-spells";

on("change:repeating_rune:rune_name", UpdateRune);
on("change:repeating_rune:rune_natura", UpdateRune);

on("change:repeating_ritual:ritual_name", UpdateRitual);
on("change:repeating_ritual:ritual_essence", UpdateRitual);

on("change:repeating_spell:spell_saveDTSkill", UpdateSpellSaveDT);
on("change:repeating_spell:spell_saveDTAttribute", UpdateSpellSaveDT);
on("change:repeating_spell:spell_saveDTBonus", UpdateSpellSaveDT);
on("change:repeating_spell:spell_name", UpdateSpell);
on("change:repeating_spell:spell_natura", UpdateSpell);
on("change:repeating_spell:spell_memorised", UpdateMaxMemorisedSpells);
on("remove:repeating_spell", UpdateMemorisedSpells);

on("change:repeating_curse:curse_name", UpdateCurse);

on("change:repeating_potion:potion_name", UpdatePotion);

on("clicked:repeating_blessing:blessinginvoke", InvokeBlessing);
on("clicked:repeating_spell:spellcast", CastSpell);
on("clicked:repeating_ritual:performritual", PerformRitual);
on("clicked:repeating_rune:carverune", CarveRune);
on("clicked:repeating_potion:brewpotion", BrewPotion);