import { Signed } from "../../helpers";
import { UpdateMeleeWeapons } from "../combat/update-meleeweapons";
import { UpdateRangedWeapons } from "../combat/update-rangedweapons";
import { UpdateDAV, UpdateUnarmedStrike } from "../update-combat";
import { UpdateSpellSaveDTs } from "../magic/update-spells";

export function UpdateArtillery() {
    getAttrs(["artillery", "agi"], function(values) {
        const skill = parseInt(values.artillery)||0;
        const stat = parseInt(values.agi)||0;

        const mod = skill + stat;

        setAttrs({
            "artillery": skill,
            "artilleryMod": Signed(mod),
            "artilleryPassive": 10 + mod
        });

        UpdateRangedWeapons(); // for atk
        UpdateSpellSaveDTs();
    });
}

export function UpdateBow() {
    getAttrs(["bow", "agi"], function(values) {
        const skill = parseInt(values.bow)||0;
        const stat = parseInt(values.agi)||0;

        const mod = skill + stat;

        setAttrs({
            "bow": skill,
            "bowMod": Signed(mod),
            "bowPassive": 10 + mod
        });
        
        UpdateRangedWeapons(); // for atk
        UpdateSpellSaveDTs();
    });
}

export function UpdateBrawling() {
    getAttrs(["brawling", "agi"], function(values) {
        const skill = parseInt(values.brawling)||0;
        const stat = parseInt(values.agi)||0;

        const mod = skill + stat;

        setAttrs({
            "brawling": skill,
            "brawlingMod": Signed(mod),
            "brawlingPassive": 10 + mod
        });

        UpdateUnarmedStrike();
        UpdateMeleeWeapons(); // for atk
        UpdateSpellSaveDTs();
    });
}

export function UpdateOneHandedMelee() {
    getAttrs(["onehandedmelee", "agi"], function(values) {
        const skill = parseInt(values.onehandedmelee)||0;
        const stat = parseInt(values.agi)||0;

        const mod = skill + stat;

        setAttrs({
            "onehandedmelee": skill,
            "onehandedmeleeMod": Signed(mod),
            "onehandedmeleePassive": 10 + mod
        });

        UpdateMeleeWeapons(); // for atk
        UpdateSpellSaveDTs();
    });
}

export function UpdatePistol() {
    getAttrs(["pistol", "agi"], function(values) {
        const skill = parseInt(values.pistol)||0;
        const stat = parseInt(values.agi)||0;

        const mod = skill + stat;

        setAttrs({
            "pistol": skill,
            "pistolMod": Signed(mod),
            "pistolPassive": 10 + mod
        });
        
        UpdateRangedWeapons(); // for atk
        UpdateSpellSaveDTs();
    });
}

export function UpdateRifle() {
    getAttrs(["rifle", "agi"], function(values) {
        const skill = parseInt(values.rifle)||0;
        const stat = parseInt(values.agi)||0;

        const mod = skill + stat;

        setAttrs({
            "rifle": skill,
            "rifleMod": Signed(mod),
            "riflePassive": 10 + mod
        });
        
        UpdateRangedWeapons(); // for atk
        UpdateSpellSaveDTs();
    });
}

export function UpdateShield() {
    getAttrs(["shield", "bod"], function(values) {
        const skill = parseInt(values.shield)||0;
        const stat = parseInt(values.bod)||0;

        const mod = skill + stat;

        setAttrs({
            "shield": skill,
            "shieldMod": Signed(mod),
            "shieldPassive": 10 + mod
        });

        UpdateDAV();
        UpdateMeleeWeapons(); // for atk
        UpdateSpellSaveDTs();
    });
}

export function UpdateTwoHandedMelee() {
    getAttrs(["twohandedmelee", "bod"], function(values) {
        const skill = parseInt(values.twohandedmelee)||0;
        const stat = parseInt(values.bod)||0;

        const mod = skill + stat;

        setAttrs({
            "twohandedmelee": skill,
            "twohandedmeleeMod": Signed(mod),
            "twohandedmeleePassive": 10 + mod
        });
        
        UpdateMeleeWeapons(); // for atk
        UpdateSpellSaveDTs();
    });
}