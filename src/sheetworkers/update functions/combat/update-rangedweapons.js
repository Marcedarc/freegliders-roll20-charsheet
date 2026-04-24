import { DamageStringToTemplateRollString, GetCustomTemplateAtkString, Signed } from "../../helpers";
import { CUSTOM_TEMPLATE_BEGINNING } from "../../worker-constants";

const RANGED_WEAPONS = {
    "derringer": {
        skill: "Pistol",
        properties: {
            light: true,
            armorPiercing: 1
        },
        damage: "1d4 Piercing",
        range: "6m/20m",
        ammoMax: 1,
        ammoType: "Bullet"
    },
    "flintlock pistol": {
        skill: "Pistol",
        properties: {
            light: true,
            armorPiercing: 1
        },
        damage: "1d6 Piercing",
        range: "8m/30m",
        ammoMax: 1,
        ammoType: "Bullet"
    },
    "revolver": {
        skill: "Pistol",
        properties: {
            light: true,
            armorPiercing: 1
        },
        damage: "1d6 Piercing",
        range: "8m/30m",
        ammoMax: 6,
        ammoType: "Bullet"
    },
    "pepperbox": {
        skill: "Pistol",
        properties: {
            light: true,
            armorPiercing: 2
        },
        damage: "1d8 Piercing",
        range: "6m/20m",
        ammoMax: 4,
        ammoType: "Bullet"
    },
    "flintlock rifle": {
        skill: "Rifle",
        properties: {
            armorPiercing: 3,
            twoHanded: true
        },
        damage: "1d10 Piercing",
        range: "12m/40m",
        ammoMax: 1,
        ammoType: "Bullet"
    },
    "blunderbuss": {
        skill: "Rifle",
        properties: {
            heavy: true,
            armorPiercing: 3,
            twoHanded: true
        },
        damage: "2d6 Piercing",
        range: "6m/20m",
        ammoMax: 1,
        ammoType: "Shell"
    },
    "lever-action rifle": {
        skill: "Rifle",
        properties: {
            armorPiercing: 3,
            twoHanded: true
        },
        damage: "1d10 Piercing",
        range: "8m/30m",
        ammoMax: 7,
        ammoType: "Round"
    },
    "bolt-action rifle": {
        skill: "Rifle",
        properties: {
            armorPiercing: 3,
            twoHanded: true
        },
        damage: "1d10 Piercing",
        range: "12m/40m",
        ammoMax: 10,
        ammoType: "Round"
    },
    "shotgun": {
        skill: "Rifle",
        properties: {
            armorPiercing: 3,
            twoHanded: true
        },
        damage: "2d6 Piercing",
        range: "8m/30m",
        ammoMax: 2,
        ammoType: "Shell"
    },
    "hand-crossbow": {
        skill: "Pistol",
        properties: {
            light: true,
            silent: true,
            armorPiercing: 1
        },
        damage: "1d4 Piercing",
        range: "12m/40m",
        ammoMax: 1,
        ammoType: "Bolt"
    },
    "crossbow": {
        skill: "Rifle",
        properties: {
            twoHanded: true,
            silent: true,
            armorPiercing: 2
        },
        damage: "1d8 Piercing",
        range: "30m/120m",
        ammoMax: 1,
        ammoType: "Bolt"
    },
    "shortbow": {
        skill: "Bow",
        properties: {
            twoHanded: true,
            silent: true
        },
        damage: "1d8 Piercing",
        range: "24m/100m",
        ammoMax: 1,
        ammoType: "Arrow"
    },
    "longbow": {
        skill: "Bow",
        properties: {
            twoHanded: true,
            silent: true
        },
        damage: "1d10 Piercing",
        range: "46m/180m",
        ammoMax: 1,
        ammoType: "Arrow"
    },
    "rocket launcher": {
        skill: "Artillery",
        properties: {
            twoHanded: true,
            heavy: true
        },
        damage: "2d10+[Q] Blunt 1d10 Fire",
        range: "8m/30m",
        ammoMax: 1,
        ammoType: "Rocket"
    },
    "machine gun (normal)": {
        skill: "Artillery",
        properties: {
            twoHanded: true,
            heavy: true,
            armorPiercing: 5
        },
        damage: "3d8 Piercing",
        range: "8m/30m",
        ammoMax: 10,
        ammoType: "Salvo"
    },
    "machine gun (spray)": {
        skill: "Artillery",
        properties: {
            twoHanded: true,
            heavy: true,
            armorPiercing: 5
        },
        damage: "1d8 Piercing",
        range: "8m Cone",
        ammoMax: 10,
        ammoType: "Salvo"
    },
    "flamethrower": {
        skill: "Artillery",
        properties: {
            twoHanded: true,
            heavy: true
        },
        damage: "4d6 Fire 1d4 Burning",
        range: "6m Cone",
        ammoMax: 20,
        ammoType: "Fuel"
    },
    "railgun": {
        skill: "Artillery",
        properties: {
            twoHanded: true,
            heavy: true,
            powered: 4,
            armorPiercing: 10
        },
        damage: "4d12 Piercing",
        range: "100m/500m",
        ammoMax: 1,
        ammoType: "Rail Dart"
    }
};

export function UpdateRangedWeapon(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }
    
    let rowId = eventInfo.sourceAttribute.split("_")[2];

    DoUpdateRangedWeapon(rowId);
    UpdateRangedWeaponRoll(eventInfo);
}

export function UpdateRangedWeapons() {
    getSectionIDs("rangedWeapon", function(ids) {
        for(var i = 0; i < ids.length; i++) {
            let prefix = "repeating_rangedWeapon_" + ids[i] + "_";

            DoUpdateRangedWeapon(ids[i]);
            UpdateRangedWeaponRoll({sourceAttribute: prefix});
        }
    });
}

function DoUpdateRangedWeapon(id) {
    let prefix = "repeating_rangedWeapon_" + id + "_";
    
    getAttrs([prefix+"rangedWeapon_name", prefix+"rangedWeapon_weaponExpert", prefix+"rangedWeapon_quality", prefix+"rangedWeapon_skill", prefix+"rangedWeapon_damage"], function(values) {
        let weaponName = values[prefix+"rangedWeapon_name"] || "";
        let isWeaponExpert = values[prefix + "rangedWeapon_weaponExpert"] == 'on';
        let weaponQuality = parseInt(values[prefix + "rangedWeapon_quality"]) || 0;
        let weaponSkill = values[prefix+"rangedWeapon_skill"] || "";
        let weaponDamage = values[prefix+"rangedWeapon_damage"] || "";

        let listWeapon = RANGED_WEAPONS[weaponName.toLowerCase()];
        let skill = listWeapon !== undefined ? listWeapon.skill : weaponSkill;

        let attributes = {};
        
        if(listWeapon !== undefined) {
            attributes[prefix+"rangedWeapon_skill"] = listWeapon.skill;
            attributes[prefix+"rangedWeapon_range"] = listWeapon.range;
            attributes[prefix+"rangedWeapon_ammo"] = listWeapon.ammoMax;
        }

        let sanitizedSkillName = skill.toLowerCase().replace(" ", "").replace("-", "");

        getAttrs([sanitizedSkillName + "Mod", "bod", "agi", "gunsmithing", sanitizedSkillName], function(values) {
            let skillMod = values[sanitizedSkillName + "Mod"] || "+0";
            let bod = values["bod"] || "+0";
            let agi = values["agi"] || "+0";
            let gunsmithing = parseInt(values["gunsmithing"]) || 0;
            let skillRanks = parseInt(values[sanitizedSkillName]) || 0;

            // ATK with Gun Training
            if(gunsmithing > skillRanks) {
                attributes[prefix+"rangedWeapon_atk"] = Signed(Math.max(skillRanks, Math.floor(gunsmithing / 2)) + parseInt(agi));
            }
            else {
                attributes[prefix+"rangedWeapon_atk"] = skillMod;
            }
            // Weapon Expert
            if(isWeaponExpert) {    
                attributes[prefix+"rangedWeapon_atk"] += "+2";
            }

            // Damage
            // Fill in Quality
            let damage = weaponDamage;
            if(listWeapon !== undefined) {
                damage = listWeapon.damage;
            }
            let damageParts = damage.replaceAll("[Q]", weaponQuality).split(" ");
            // Gunsmith Extra Damage
            if(weaponQuality >= 5) {
                let diceRegex = /^(\d*)([dD]\d*)/;
                // We check if there even is a dice component at the start
                // (has to be at start to be considered base damage dice)
                let regexMatch = damageParts[0].match(diceRegex);
                if(regexMatch) {
                    let dieSize = regexMatch[2]; // second capture group is die including the "d"
                    let extraDamageDice = Math.floor(weaponQuality / 5) + dieSize;
                    
                    let extraDamageIndex = damageParts[0].search(/[+-]\d*[dD]?\d*\[ExtraDamage\]/g);
                    if(extraDamageIndex == -1) {
                        damageParts[0] += "+" + extraDamageDice + "[ExtraDamage]";
                    }
                    else {
                        damageParts[0] = damageParts[0].replaceAll(/[+-]\d*[dD]?\d*\[ExtraDamage\]/g, "+" + extraDamageDice + "[ExtraDamage]");
                    }
                }
            }
            else {
                damageParts[0] = damageParts[0].replaceAll(/[+-]\d*[dD]?\d*\[ExtraDamage\]/g, "");
            }
            // Attribute Mod
            if(skill == "Pistol" || skill == "Rifle") {
                let agiIndex = damageParts[0].search(/[+-]\d*[dD]?\d*\[AGI\]/g);
                let bodIndex = damageParts[0].search(/[+-]\d*d?\[dD]*\[BOD\]/g);
                if(agiIndex > -1) {
                    damageParts[0] = damageParts[0].replaceAll(/[+-]\d*[dD]?\d*\[AGI\]/g, agi + "[AGI]");
                }
                if(bodIndex > -1) {
                    damageParts[0] = damageParts[0].replaceAll(/[+-]\d*[dD]?\d*\[BOD\]/g, agi + "[AGI]");
                }
                if(agiIndex == -1 && bodIndex == -1) {
                    damageParts[0] += agi + "[AGI]";
                }
            }
            else if (skill == "Bow") {
                let agiIndex = damageParts[0].search(/[+-]\d*[dD]?\d*\[AGI\]/g);
                let bodIndex = damageParts[0].search(/[+-]\d*[dD]?\d*\[BOD\]/g);
                if(agiIndex > -1) {
                    damageParts[0] = damageParts[0].replaceAll(/[+-]\d*[dD]?\d*\[AGI\]/g, bod + "[BOD]");
                }
                if(bodIndex > -1) {
                    damageParts[0] = damageParts[0].replaceAll(/[+-]\d*[dD]?\d*\[BOD\]/g, bod + "[BOD]");
                }
                if(agiIndex == -1 && bodIndex == -1) {
                    damageParts[0] += bod + "[BOD]";
                }
            }
            else {
                damageParts[0] = damageParts[0].replaceAll(/[+-]\d*[dD]?\d*\[BOD\]/g, "");
                damageParts[0] = damageParts[0].replaceAll(/[+-]\d*[dD]?\d*\[AGI\]/g, "");
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

            let damageText = damageParts[0];
            for(let i = 1; i < damageParts.length; i++) {
                damageText += " " + damageParts[i];
            }

            attributes[prefix+"rangedWeapon_damage"] = damageText;

            setAttrs(attributes);
        });
    });
}

export function UpdateRangedWeaponRoll(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }
    
    let rowId = eventInfo.sourceAttribute.split("_")[2];
    let prefix = "repeating_rangedWeapon_" + rowId + "_";
    
    let attributes = {};

    getAttrs([prefix+"rangedWeapon_name", prefix+"rangedWeapon_damage", prefix+"rangedWeapon_atk", "athletics", "stealth", "artillery", prefix+"rangedWeapon_skill"], function(values) {
        let weaponName = values[prefix+"rangedWeapon_name"] || "";
        let weaponDamage = values[prefix+"rangedWeapon_damage"] || "";
        let weaponAtk = values[prefix+"rangedWeapon_atk"] || "";
        let athleticsRanks = parseInt(values["athletics"]) || 0;
        let stealthRanks = parseInt(values["stealth"]) || 0;
        let artilleryRanks = parseInt(values["artillery"]) || 0;
        let weaponSkill = values[prefix+"rangedWeapon_skill"] || "";

        let roll = `${CUSTOM_TEMPLATE_BEGINNING}{{name=${weaponName} Attack}}`;

        // To Hit
        if(weaponAtk != "") {
            roll += GetCustomTemplateAtkString(weaponAtk);
        }

        // Damage
        let damageAddsBOD = weaponSkill == "Bow";
        roll += DamageStringToTemplateRollString(weaponDamage, true, stealthRanks, damageAddsBOD, athleticsRanks, weaponSkill, artilleryRanks);

        attributes[prefix+"rangedWeapon_roll"] = roll;

        setAttrs(attributes);
    });
}