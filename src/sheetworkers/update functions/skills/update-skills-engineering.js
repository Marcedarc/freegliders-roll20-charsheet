import { Signed } from "../../helpers";
import { UpdateRangedWeapons } from "../combat/update-rangedweapons";
import { UpdateSpellSaveDTs } from "../magic/update-spells";

export function UpdateAugmentation() {
    getAttrs(["augmentation", "log"], function(values) {
        const skill = parseInt(values.augmentation)||0;
        const stat = parseInt(values.log)||0;

        const mod = skill + stat;

        setAttrs({
            "augmentation": skill,
            "augmentationMod": Signed(mod),
            "augmentationPassive": 10 + mod
        });
        
        UpdateSpellSaveDTs();
    });
}

export function UpdateAutomachinery() {
    getAttrs(["automachinery", "log"], function(values) {
        const skill = parseInt(values.automachinery)||0;
        const stat = parseInt(values.log)||0;

        const mod = skill + stat;

        setAttrs({
            "automachinery": skill,
            "automachineryMod": Signed(mod),
            "automachineryPassive": 10 + mod
        });
        
        UpdateSpellSaveDTs();
    });
}

export function UpdateClockworkMechanics() {
    getAttrs(["clockworkmechanics", "log"], function(values) {
        const skill = parseInt(values.clockworkmechanics)||0;
        const stat = parseInt(values.log)||0;

        const mod = skill + stat;

        setAttrs({
            "clockworkmechanics": skill,
            "clockworkmechanicsMod": Signed(mod),
            "clockworkmechanicsPassive": 10 + mod
        });
        
        UpdateSpellSaveDTs();
    });
}

export function UpdateGunsmithing() {
    getAttrs(["gunsmithing", "agi"], function(values) {
        const skill = parseInt(values.gunsmithing)||0;
        const stat = parseInt(values.agi)||0;

        const mod = skill + stat;

        setAttrs({
            "gunsmithing": skill,
            "gunsmithingMod": Signed(mod),
            "gunsmithingPassive": 10 + mod
        });

        UpdateRangedWeapons(); // For Gun Training
        UpdateSpellSaveDTs();
    });
}

export function UpdateTinkering() {
    getAttrs(["tinkering", "agi"], function(values) {
        const skill = parseInt(values.tinkering)||0;
        const stat = parseInt(values.agi)||0;

        const mod = skill + stat;

        setAttrs({
            "tinkering": skill,
            "tinkeringMod": Signed(mod),
            "tinkeringPassive": 10 + mod
        });
        
        UpdateSpellSaveDTs();
    });
}

export function UpdateVehicleMechanics() {
    getAttrs(["vehiclemechanics", "bod"], function(values) {
        const skill = parseInt(values.vehiclemechanics)||0;
        const stat = parseInt(values.bod)||0;

        const mod = skill + stat;

        setAttrs({
            "vehiclemechanics": skill,
            "vehiclemechanicsMod": Signed(mod),
            "vehiclemechanicsPassive": 10 + mod
        });
        
        UpdateSpellSaveDTs();
    });
}