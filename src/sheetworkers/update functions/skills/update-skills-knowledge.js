import { Signed } from "../../helpers";
import { UpdateSpellSaveDTs } from "../magic/update-spells";

export function UpdateAstronomy() {
    getAttrs(["astronomy", "log", "educatedBonus"], function(values) {
        const astronomy = parseInt(values.astronomy)||0;
        const log = parseInt(values.log)||0;
        const educatedBonus = parseInt(values.educatedBonus)||0;

        const mod = astronomy + log + educatedBonus;

        setAttrs({
            "astronomy": astronomy,
            "astronomyMod": Signed(mod),
            "astronomyPassive": 10 + mod
        });
        
        UpdateSpellSaveDTs();
    });
}

export function UpdateEconomy() {
    getAttrs(["economy", "log", "educatedBonus"], function(values) {
        const economy = parseInt(values.economy)||0;
        const log = parseInt(values.log)||0;
        const educatedBonus = parseInt(values.educatedBonus)||0;

        const mod = economy + log + educatedBonus;

        setAttrs({
            "economy": economy,
            "economyMod": Signed(mod),
            "economyPassive": 10 + mod
        });
        
        UpdateSpellSaveDTs();
    });
}

export function UpdateHistory() {
    getAttrs(["history", "log", "educatedBonus"], function(values) {
        const history = parseInt(values.history)||0;
        const log = parseInt(values.log)||0;
        const educatedBonus = parseInt(values.educatedBonus)||0;

        const mod = history + log + educatedBonus;

        setAttrs({
            "history": history,
            "historyMod": Signed(mod),
            "historyPassive": 10 + mod
        });
        
        UpdateSpellSaveDTs();
    });
}

export function UpdateLiterature() {
    getAttrs(["literature", "log", "educatedBonus"], function(values) {
        const literature = parseInt(values.literature)||0;
        const log = parseInt(values.log)||0;
        const educatedBonus = parseInt(values.educatedBonus)||0;

        const mod = literature + log + educatedBonus;

        setAttrs({
            "literature": literature,
            "literatureMod": Signed(mod),
            "literaturePassive": 10 + mod
        });
        
        UpdateSpellSaveDTs();
    });
}

export function UpdateMedicine() {
    getAttrs(["medicine", "log", "educatedBonus"], function(values) {
        const medicine = parseInt(values.medicine)||0;
        const log = parseInt(values.log)||0;
        const educatedBonus = parseInt(values.educatedBonus)||0;

        const mod = medicine + log + educatedBonus;

        setAttrs({
            "medicine": medicine,
            "medicineMod": Signed(mod),
            "medicinePassive": 10 + mod
        });
        
        UpdateSpellSaveDTs();
    });
}

export function UpdateMythology() {
    getAttrs(["mythology", "log", "educatedBonus"], function(values) {
        const mythology = parseInt(values.mythology)||0;
        const log = parseInt(values.log)||0;
        const educatedBonus = parseInt(values.educatedBonus)||0;

        const mod = mythology + log + educatedBonus;

        setAttrs({
            "mythology": mythology,
            "mythologyMod": Signed(mod),
            "mythologyPassive": 10 + mod
        });
        
        UpdateSpellSaveDTs();
    });
}

export function UpdateNature() {
    getAttrs(["nature", "log", "educatedBonus"], function(values) {
        const nature = parseInt(values.nature)||0;
        const log = parseInt(values.log)||0;
        const educatedBonus = parseInt(values.educatedBonus)||0;

        const mod = nature + log + educatedBonus;

        setAttrs({
            "nature": nature,
            "natureMod": Signed(mod),
            "naturePassive": 10 + mod
        });
        
        UpdateSpellSaveDTs();
    });
}

export function UpdateSurvival() {
    getAttrs(["survival", "int", "educatedBonus"], function(values) {
        const survival = parseInt(values.survival)||0;
        const int = parseInt(values.int)||0;
        const educatedBonus = parseInt(values.educatedBonus)||0;

        const mod = survival + int + educatedBonus;

        setAttrs({
            "survival": survival,
            "survivalMod": Signed(mod),
            "survivalPassive": 10 + mod
        });
        
        UpdateSpellSaveDTs();
    });
}