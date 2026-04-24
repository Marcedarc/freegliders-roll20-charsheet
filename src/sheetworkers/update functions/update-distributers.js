import { UpdateBlessings } from "./magic/update-blessings";
import { UpdatePotions } from "./magic/update-potions";
import { UpdateRituals } from "./magic/update-rituals";
import { UpdateRunes } from "./magic/update-runes";
import { UpdateSpells } from "./magic/update-spells";
import { UpdateAstronomy, UpdateEconomy, UpdateHistory, UpdateLiterature, UpdateMedicine, UpdateMythology, UpdateNature, UpdateSurvival } from "./skills/update-skills-knowledge";
import { UpdateAgi, UpdateBod, UpdateCha, UpdateInt, UpdateLog, UpdateWil } from "./update-attributes";
import { UpdateHP } from "./update-combat";

export function UpdateAttributes() {
    UpdateAgi();
    UpdateBod();
    UpdateCha();
    UpdateInt();
    UpdateLog();
    UpdateWil();
}

export function UpdateKnowledgeSkills() {
    UpdateAstronomy();
    UpdateEconomy();
    UpdateHistory();
    UpdateLiterature();
    UpdateMedicine();
    UpdateMythology();
    UpdateNature();
    UpdateSurvival();
}

export function UpdateLevelStats() {
    UpdateHP();
}

export function UpdateEssence() {
    UpdateSpells();
    UpdateRituals();
    UpdateRunes();
    UpdatePotions();
}

export function SheetOpened() {
    UpdateAttributes();
    UpdateBlessings();
    UpdateSpells();
    UpdateRituals();
    UpdateRunes();
    UpdatePotions();
}