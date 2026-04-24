import { DamageStringToTemplateRollString, GetCustomTemplateAtkString } from "../../helpers";
import { CUSTOM_TEMPLATE_BEGINNING } from "../../worker-constants";

const MELEE_WEAPONS = {
    "brass knuckle": {
        skill: "Brawling",
        properties: {
            light: true
        },
        damage: "1d4 Blunt"
    },
    "cestus": {
        skill: "Brawling",
        properties: {
            light: true
        },
        damage: "1d6 Blunt"
    },
    "knife": {
        skill: "One-Handed Melee",
        properties: {
            light: true
        },
        damage: "1d4 Slashing"
    },
    "dagger": {
        skill: "One-Handed Melee",
        properties: {
            light: true
        },
        damage: "1d4 Piercing"
    },
    "throwing knife": {
        skill: "One-Handed Melee",
        properties: {
            light: true,
            thrown: {
                close: "6m",
                long: "18m"
            }
        },
        damage: "1d4 Piercing"
    },
    "broadsword": {
        skill: "One-Handed Melee",
        damage: "1d8 Slashing"
    },
    "longsword": {
        skill: "One-Handed Melee",
        properties: {
            Versatile: "1d12"
        },
        damage: "1d10 Slashing"
    },
    "cutlass": {
        skill: "One-Handed Melee",
        properties: {
            light: true
        },
        damage: "1d6 Slashing"
    },
    "rapier": {
        skill: "One-Handed Melee",
        damage: "1d8 Slashing"
    },
    "smallsword": {
        skill: "One-Handed Melee",
        properties: {
            light: true
        },
        damage: "1d6 Piercing"
    },
    "cane sword": {
        skill: "One-Handed Melee",
        damage: "1d6 Slashing"
    },
    "hardened cane": {
        skill: "One-Handed Melee",
        damage: "1d6 Blunt"
    },
    "baton": {
        skill: "One-Handed Melee",
        properties: {
            light: true
        },
        damage: "1d8 Blunt"
    },
    "spiked club": {
        skill: "One-Handed Melee",
        damage: "1d6 Blunt 1d4 Piercing"
    },
    "mace": {
        skill: "One-Handed Melee",
        damage: "1d8 Blunt"
    },
    "warhammer": {
        skill: "One-Handed Melee",
        properties: {
            Versatile: "1d10"
        },
        damage: "1d8 Blunt"
    },
    "war pick": {
        skill: "One-Handed Melee",
        properties: {
            Versatile: "1d10"
        },
        damage: "1d8 Piercing"
    },
    "battle axe": {
        skill: "One-Handed Melee",
        properties: {
            Versatile: "1d10"
        },
        damage: "1d8 Slashing"
    },
    "throwing axe": {
        skill: "One-Handed Melee",
        properties: {
            thrown: {
                close: "6m",
                long: "18m"
            }
        },
        damage: "1d6 Slashing"
    },
    "hatchet": {
        skill: "One-Handed Melee",
        properties: {
            light: true
        },
        damage: "1d6 Slashing"
    },
    "staff": {
        skill: "One-Handed Melee",
        properties: {
            Versatile: "1d8"
        },
        damage: "1d6 Blunt"
    },
    "greatsword": {
        skill: "Two-Handed Melee",
        properties: {
            twoHanded: true
        },
        damage: "2d6 Slashing"
    },
    "maul": {
        skill: "Two-Handed Melee",
        properties: {
            twoHanded: true
        },
        damage: "1d12 Blunt"
    },
    "pike": {
        skill: "Two-Handed Melee",
        properties: {
            twoHanded: true
        },
        damage: "1d8 Piercing"
    },
    "halberd": {
        skill: "Two-Handed Melee",
        properties: {
            twoHanded: true
        },
        damage: "1d8 Slashing"
    },
    "glaive": {
        skill: "Two-Handed Melee",
        properties: {
            twoHanded: true
        },
        damage: "1d10 Piercing"
    },
    "whip": {
        skill: "Two-Handed Melee",
        properties: {
            twoHanded: true
        },
        damage: "1d6 Slashing"
    }
};

export function UpdateMeleeWeapon(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }
    
    let rowId = eventInfo.sourceAttribute.split("_")[2];

    DoUpdateMeleeWeapon(rowId);
    UpdateMeleeWeaponRoll(eventInfo);
}

export function UpdateMeleeWeapons() {
    getSectionIDs("meleeWeapon", function(ids) {
        for(var i = 0; i < ids.length; i++) {
            let prefix = "repeating_meleeWeapon_" + ids[i] + "_";

            DoUpdateMeleeWeapon(ids[i]);
            UpdateMeleeWeaponRoll({sourceAttribute: prefix});
        }
    });
}

function DoUpdateMeleeWeapon(id) {
    let prefix = "repeating_meleeWeapon_" + id + "_";
    
    getAttrs([prefix+"meleeWeapon_name", prefix+"meleeWeapon_weaponExpert", prefix+"meleeWeapon_skill", prefix+"meleeWeapon_damage"], function(values) {
        let weaponName = values[prefix+"meleeWeapon_name"] || "";
        let isWeaponExpert = values[prefix + "meleeWeapon_weaponExpert"] == 'on';
        let weaponSkill = values[prefix+"meleeWeapon_skill"] || "";
        let weaponDamage = values[prefix+"meleeWeapon_damage"] || "";

        let listWeapon = MELEE_WEAPONS[weaponName.toLowerCase()];
        let skill = listWeapon !== undefined? listWeapon.skill : weaponSkill;

        let sanitizedSkillName = skill.toLowerCase().replace(" ", "").replace("-", "");

        let attributes = {};

        if(listWeapon !== undefined) {
            attributes[prefix+"meleeWeapon_skill"] = listWeapon.skill;
        }

        getAttrs([sanitizedSkillName + "Mod", "bod", "brawling"], function(values) {
            let skillMod = values[sanitizedSkillName + "Mod"] || "+0";
            let bod = values["bod"] || "+0";
            let brawlingRanks = parseInt(values["brawling"]) || 0;

            // ATK
            attributes[prefix+"meleeWeapon_atk"] = skillMod;
            // Weapon Expert
            if(isWeaponExpert) {
                attributes[prefix+"meleeWeapon_atk"] += "+2";
            }

            // Damage
            let damageParts = weaponDamage.split(" ");
            if(listWeapon !== undefined) {
                damageParts = listWeapon.damage.split(" ");
            }
            let bodIndex = damageParts[0].search(/[+-]\d*[dD]?\d*\[BOD\]/g);
            if(bodIndex == -1) {
                damageParts[0] += bod + "[BOD]";
            }
            else {
                damageParts[0] = damageParts[0].replaceAll(/[+-]\d*[dD]?\d*\[BOD\]/g, bod + "[BOD]");
            }
            // Weapon Expert
            if(isWeaponExpert) {
                let weaponExpertIndex = damageParts[0].search(/[+-]\d*[dD]?\d*\[WeaponExpert\]/g);
                if(weaponExpertIndex == -1) {
                    damageParts[0] += "+2[WeaponExpert]";
                }
                else {
                    damageParts[0] = damageParts[0].replaceAll(/[+-]\d*[dD]?\d*\[WeaponExpert\]/g, "+2[WeaponExpert]");
                }
            }
            else {
                damageParts[0] = damageParts[0].replaceAll(/[+-]\d*[dD]?\d*\[WeaponExpert\]/g, "");
            }
            // Martial Arts
            if(skill == "Brawling" && brawlingRanks > 0) {
                let martialArtsDice = Math.floor((brawlingRanks + 2) / 3)
                let martialArtsIndex = damageParts[0].search(/[+-]\d*[dD]?\d*\[MartialArts\]/g);
                if(martialArtsIndex == -1) {
                    damageParts[0] += "+" + martialArtsDice + "d4[MartialArts]";
                }
                else {
                    damageParts[0] = damageParts[0].replaceAll(/[+-]\d*[dD]?\d*\[MartialArts\]/g, "+" + martialArtsDice + "d4[MartialArts]");
                }
            }
            else {
                damageParts[0] = damageParts[0].replaceAll(/[+-]\d*[dD]?\d*\[MartialArts\]/g, "");
            }

            let damageText = damageParts[0];
            for(let i = 1; i < damageParts.length; i++) {
                damageText += " " + damageParts[i];
            }

            attributes[prefix+"meleeWeapon_damage"] = damageText;

            setAttrs(attributes);
        });
    });
}

export function UpdateMeleeWeaponRoll(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }
    
    let rowId = eventInfo.sourceAttribute.split("_")[2];
    let prefix = "repeating_meleeWeapon_" + rowId + "_";
    
    let attributes = {};

    getAttrs([prefix+"meleeWeapon_name", prefix+"meleeWeapon_damage", prefix+"meleeWeapon_atk", prefix+"meleeWeapon_skill", "athletics", "stealth", "augmentation"], function(values) {
        let weaponName = values[prefix+"meleeWeapon_name"] || "";
        let weaponDamage = values[prefix+"meleeWeapon_damage"] || "";
        let weaponAtk = values[prefix+"meleeWeapon_atk"] || "";
        let weaponSkill = values[prefix+"meleeWeapon_skill"] || "";
        let athleticsRanks = parseInt(values["athletics"]) || 0;
        let stealthRanks = parseInt(values["stealth"]) || 0;
        let augmentationRanks = parseInt(values["augmentation"]) || 0;

        let roll = `${CUSTOM_TEMPLATE_BEGINNING}{{name=${weaponName} Attack}}`;

        // To Hit
        if(weaponAtk != "") {
            roll += GetCustomTemplateAtkString(weaponAtk);
        }

        // Damage
        roll += DamageStringToTemplateRollString(weaponDamage, true, stealthRanks, true, athleticsRanks, weaponSkill, 0, augmentationRanks);

        attributes[prefix+"meleeWeapon_roll"] = roll;

        setAttrs(attributes);
    });
}