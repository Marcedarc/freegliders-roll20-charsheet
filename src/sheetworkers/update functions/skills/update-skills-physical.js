import { Signed } from "../../helpers";
import { UpdateMeleeWeapons } from "../combat/update-meleeweapons";
import { UpdateRangedWeapons } from "../combat/update-rangedweapons";
import { UpdateSpellSaveDTs } from "../magic/update-spells";
import { UpdateHitDie } from "../update-combat";
import { UpdateCarryCapacity } from "../update-inventory";

export function UpdateArtisanship() {
    getAttrs(["artisanship", "agi"], function(values) {
        let artisanship = parseInt(values.artisanship)||0;
        let agi = parseInt(values.agi)||0;

        let mod = artisanship+agi;

        setAttrs({
            "artisanship": artisanship,
            "artisanshipMod": Signed(mod),
            "artisanshipPassive": 10+mod
        });
        
        UpdateSpellSaveDTs();
      });
}

export function UpdateAthletics() {
    getAttrs(["athletics", "bod", "strongBonus", "weakPenalty"], function(values) {
        let athletics = parseInt(values.athletics)||0;
        let bod = parseInt(values.bod)||0;
        let strongBonus = parseInt(values.strongBonus)||0;
        let weakPenalty = parseInt(values.weakPenalty)||0;

        let mod = athletics + bod + strongBonus + weakPenalty;

        setAttrs({
            "athletics": athletics,
            "athleticsMod": Signed(mod),
            "athleticsPassive": 10+mod
        });

        UpdateHitDie();
        UpdateCarryCapacity();
        UpdateMeleeWeapons(); // for Powerful Strike
        UpdateRangedWeapons(); // for Powerful Strike
        UpdateSpellSaveDTs();
      });
}

export function UpdatePerception() {
    getAttrs(["perception", "int"], function(values) {
        let perception = parseInt(values.perception)||0;
        let int = parseInt(values.int)||0;

        let mod = perception + int;

        setAttrs({
            "perception": perception,
            "perceptionMod": Signed(mod),
            "perceptionPassive": 10+mod
        });
        
        UpdateSpellSaveDTs();
      });
}

export function UpdatePiloting() {
    getAttrs(["piloting", "agi"], function(values) {
        let piloting = parseInt(values.piloting)||0;
        let agi = parseInt(values.agi)||0;

        let mod = piloting+agi;

        setAttrs({
            "piloting": piloting,
            "pilotingMod": Signed(mod),
            "pilotingPassive": 10+mod
        });
        
        UpdateSpellSaveDTs();
      });
}

export function UpdateStealth() {
    getAttrs(["stealth", "agi", "sneakyBonus"], function(values) {
        let stealth = parseInt(values.stealth)||0;
        let agi = parseInt(values.agi)||0;
        let sneakyBonus = parseInt(values.sneakyBonus)||0;

        let mod = stealth+agi+sneakyBonus;

        setAttrs({
            "stealth": stealth,
            "stealthMod": Signed(mod),
            "stealthPassive": 10+mod
        });

        UpdateMeleeWeapons(); // for sneak attack
        UpdateRangedWeapons(); // for sneak attack
        UpdateSpellSaveDTs();
      });
}