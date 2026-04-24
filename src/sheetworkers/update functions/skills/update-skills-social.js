import { Signed } from "../../helpers";
import { UpdateSpellSaveDTs } from "../magic/update-spells";

export function UpdateDeception() {
    getAttrs(["deception", "cha"], function(values) {
        let deception = parseInt(values.deception)||0;
        let cha = parseInt(values.cha)||0;

        let mod = deception+cha;

        setAttrs({
            "deception": deception,
            "deceptionMod": Signed(mod),
            "deceptionPassive": 10+mod
        });
        
        UpdateSpellSaveDTs();
      });
}

export function UpdateIntimidation() {
    getAttrs(["intimidation", "cha"], function(values) {
        let intimidation = parseInt(values.intimidation)||0;
        let cha = parseInt(values.cha)||0;

        let mod = intimidation+cha;

        setAttrs({
            "intimidation": intimidation,
            "intimidationMod": Signed(mod),
            "intimidationPassive": 10+mod
        });
        
        UpdateSpellSaveDTs();
      });
}

export function UpdatePerformance() {
    getAttrs(["performance", "cha"], function(values) {
        let performance = parseInt(values.performance)||0;
        let cha = parseInt(values.cha)||0;

        let mod = performance+cha;

        setAttrs({
            "performance": performance,
            "performanceMod": Signed(mod),
            "performancePassive": 10+mod
        });
      });
}

export function UpdatePersuasion() {
    getAttrs(["persuasion", "cha"], function(values) {
        let persuasion = parseInt(values.persuasion)||0;
        let cha = parseInt(values.cha)||0;

        let mod = persuasion+cha;

        setAttrs({
            "persuasion": persuasion,
            "persuasionMod": Signed(mod),
            "persuasionPassive": 10+mod
        });
        
        UpdateSpellSaveDTs();
      });
}