import { DamageStringToTemplateRollString, GetCustomTemplateAtkString, HasEnoughEssence, ParseAttributeMods, ParseAttributes, ParseNatura, ParseSkills } from "../../helpers";
import { ATTRIBUTE_MODS, ATTRIBUTES, CUSTOM_TEMPLATE_BEGINNING, SKILLS } from "../../worker-constants";

/**
 * @typedef {Object} Spell
 * @property {string} action
 * @property {string} components
 * @property {string} natura
 * @property {string} range
 * @property {string} description
 * @property {string | undefined} duration
 * @property {string | undefined} area
 * @property {string | undefined} attackType
 * @property {string | undefined} damage
 * @property {string | undefined} saveType
 * @property {string | undefined} saveDTType
 */

/**
 * @type {Object.<string, Spell>}
 */
const SPELLS = {
    "fire bolt": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "3 Fire",
        range: "20m",
        attackType: "Ranged",
        damage: "[P]d6 Fire",
        description: "You hurl a flame at a target within range. Make a ranged spell attack against the target. If it hits, you deal [P]d6 fire damage to them and they gain 1 stack of burning."
    },
    "fireball": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "5 Fire",
        range: "20m",
        area: "10m Sphere",
        saveType: "Evasion",
        saveDTType: "srd",
        damage: "[P]d6 Fire",
        description: "You hurl a ball of fire that explodes. All creatures and objects in the target area must make an Evasion test. A target takes [P]d6 fire damage and gains 1 stack of burning on a failed test. On a successful test it takes half damage and no stack of burning."
    },
    "water bolt": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "3 Water",
        range: "20m",
        attackType: "Ranged",
        damage: "[P]d6 Blunt",
        description: "You hurl a mote of water at a target within range. Make a ranged spell attack against the target. If it hits, you deal [P]d6 blunt damage to them and they become wet."
    },
    "waterball": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "5 Water",
        range: "20m",
        area: "10m Sphere",
        saveType: "Evasion",
        saveDTType: "srd",
        damage: "[P]d6 Blunt",
        description: "You hurl a ball of water that explodes. All creatures and objects in the target area must make an Evasion test. A target takes [P]d6 blunt damage and becomes wet on a failed test. On a successful test it takes half damage and doesn’t become wet."
    },
    "tremor": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "3 Earth",
        range: "20m",
        saveType: "Evasion",
        saveDTType: "srd",
        damage: "[P]d6 Blunt",
        description: "The ground beneath a target within range shakes. The target must make an Evasion test. It takes [P]d6 blunt damage on a fail and falls prone. On a successful test it takes half damage and doesn’t fall prone."
    },
    "earthquake": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "5 Earth",
        range: "20m",
        area: "10m Circle",
        saveType: "Evasion",
        saveDTType: "srd",
        damage: "[P]d6 Blunt",
        description: "The ground in the target area within range shakes. All creatures must make an Evasion test. A target takes [P]d6 blunt damage on a fail and falls prone. On a successful test it takes half damage and doesn’t fall prone."
    },
    "air bolt": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "3 Air",
        range: "20m",
        attackType: "Ranged",
        damage: "[P]d6 Slashing",
        description: "You send a mote of condensed air at a target within range. Make a ranged spell attack against the target. If it hits, you deal [P]d6 slashing damage to them and push them 2m away from you."
    },
    "air bomb": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "5 Air",
        range: "20m",
        area: "10m Sphere",
        saveType: "Evasion",
        saveDTType: "srd",
        damage: "[P]d6 Blunt",
        description: "You hurl a mote of condensed air that explodes. All creatures and objects in the target area must make an Evasion test. A target takes [P]d6 blunt damage and is pushed 2m away from the center of the explosion. On a successful test it takes half damage and is not pushed away."
    },
    "icicle": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "2 Water, 2 Air",
        range: "20m",
        attackType: "Ranged",
        damage: "[P]d6+[P] Cold",
        description: "You hurl a pointy icicle at a target within range. Make a ranged spell attack against the target. If it hits, you deal [P]d6 + [P] cold damage to them and they gain 1 stack of bleeding."
    },
    "lava mote": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "2 Fire, 2 Earth",
        range: "20m",
        attackType: "Ranged",
        damage: "[P]d6 Blunt + [P] Fire",
        description: "You hurl a mote of molten rock at a target within range. Make a ranged spell attack against the target. If it hits, you deal [P]d6 blunt + [P] fire damage to them and they gain 1 stack of burning."
    },
    "spark": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "2 Fire, 2 Air",
        range: "20m",
        attackType: "Ranged",
        damage: "[P]d6+[P] Electrical",
        description: "You send an electrical spark to a target within range. Make a ranged spell attack against the target. If it hits, you deal [P]d6 + [P] electrical damage to them and they become nauseous until the end of their next turn."
    },
    "steam cloud": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "3 Fire, 3 Water",
        range: "20m",
        area: "10m Sphere",
        saveType: "Body",
        saveDTType: "srd",
        damage: "[P]d6+[P] Fire",
        description: "You create a cloud of hot water vapour in the target area that disperses quickly. All creatures in the area must make a Body test. They take [P]d6 + [P] fire damage and become wet on a failed test. On a successful test, they take half damage and don’t become wet."
    },
    "acid splash": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "3 Water, 3 Earth",
        range: "20m",
        area: "10m Circle",
        attackType: "Ranged",
        damage: "[P]d8+[P] Acid",
        description: "You hurl a mote of acid at a target within range. Make a ranged spell attack against the target. If it hits, you deal [P]d8 + [P] acid damage to them."
    },
    "acid rain": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "5 Water, 5 Earth",
        range: "20m",
        area: "10m/20m Cylinder",
        saveType: "Evasion",
        saveDTType: "srd",
        damage: "[P]d8+[P] Acid",
        description: "You make it rain acid in the target area. All creatures in the area must make an Evasion test. They take [P]d8 + [P] acid damage on a failed test. On a successful test, they take half damage."
    },
    "dust cloud": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "2 Earth, 2 Air",
        range: "20m",
        area: "10m Sphere",
        duration: "[P] minutes",
        description: "You create a cloud of dust in the target area that remains for the duration. The area in the cloud is heavily obscured. A strong wind can disperse the cloud, ending the spell."
    },
    "break warding": {
        action: "Major Action",
        components: "Vox",
        natura: "1 Air, 5 Fire, 1 Earth",
        range: "Touch",
        description: "You break a warding with a Power less or equal to [P], ending its effect on the target creature, object or place (a vehicle, room, or building). You can use this spell to attempt to break a warding with a higher power, but you need to succeed on a Spellwork [WIL] test against 10 + the warding’s power."
    },
    "levitate": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "4 Air",
        range: "20m",
        duration: "[P] minutes (C)",
        saveType: "Willpower",
        saveDTType: "srd",
        description: "You attempt to lift a target creature or object no heavier than [P] x 50 kg within range up to 10m up into the air for the duration. If the target is an unwilling creature, it can make a Willpower test to resist the spell on a success. While affected, the target has its speed reduced to 0 and can’t benefit from effects that increase its speed. The target can use a Major Action on its turn to repeat the Willpower test, ending the spell on a success.\nOn each of your turns while this spell is active, you can use a Minor Action to move the target up to 10m in any direction, but not through solid objects."
    },
    "unlock": {
        action: "Major Action",
        components: "Motus",
        natura: "3 Air, 1 Earth",
        range: "10m",
        description: "You unlock a target lock within range with a lock raring of [P] or lower. If the lock rating of the target is higher, you need to succeed on a Spellwork [WIL] test against 10 + the target lock’s rating, otherwise the spell fails.\nAlternatively, you can unlock a magical lock, in which case you apply the same rules except instead of the lock rating, you use the Power of the magic that keeps the lock locked."
    },
    "deflect": {
        action: "Minor Reaction",
        components: "Motus",
        natura: "1 Air, 1 Earth",
        range: "Self",
        description: "When you’re attacked by a creature you can see, you can use this spell to attempt to deflect the attack. You gain a +5 + [P] bonus to your Evasion test against the triggering attack. You can declare using this spell after rolling your Evasion test but before you know whether you would be hit or not."
    },
    "reflect": {
        action: "Major Reaction",
        components: "Motus, Vox",
        natura: "1 Air, 2 Earth, 1 Water",
        range: "Self",
        attackType: "Ranged",
        description: "When you’re attacked by a creature you can see, you can use this spell to attempt to deflect the attack and possibly make it reflect back to the attacker. You gain a +5 + [P] bonus to your Evasion test against the triggering attack. You can declare using this spell after rolling your Evasion test but before you know whether you would be hit or not. If the attack misses you, make a melee spell attack (if the triggering attack was a melee attack) or a ranged spell attack (if the triggering attack was a ranged attack) against the attacker. On a hit, the attacker takes the damage of his own attack."
    },
    "control fire": {
        action: "Minor Action",
        components: "Motus",
        natura: "1 Fire",
        range: "[P] x 10m",
        description: "You control the element of fire in a small manner around you. Choose one of the following effects:\n- You instantly light or snuff out all flammable objects (candles, oil-lamps, braziers, bonfires, and the like) in a [P]m cube within range.\n- You change the colour of all fires in a [P]m cube within range to any colour you like.\n- You warm up an object that you can see that is no larger than [P]m in any dimension for up to 10 minutes, after which it may cool down again. You can’t make it hot enough to hurt someone this way.\n- You remove [P] stacks of burning from a creature within range that you can see."
    },
    "control water": {
        action: "Minor Action",
        components: "Motus",
        natura: "1 Water",
        range: "[P] x 10m",
        description: "You control the element of water in a small manner around you. Choose one of the following effects:\n- You instantly freeze or unfreeze up to [P] liters of water within range that you can see.\n- You force any droplets of rain that would fall on a target creature or object no larger than [P]m in any dimension within range that you can see to avoid the target just before they would hit it and fall to the ground next to it instead.\n- You instantly dry or wet a surface, object, or creature no larger than [P]m in any dimension that you can see within range."
    },
    "blink": {
        action: "Minor Action",
        components: "Motus",
        natura: "3 Air",
        range: "[P] x 5m",
        description: "You along with everything you’re wearing or carrying instantly disappear and reappear in an unoccupied space within range. If you try to blink into a space that is occupied, the spell fails and the Natura is lost."
    },
    "group blink": {
        action: "Minor Action",
        components: "Motus",
        natura: "5 Air",
        range: "[P] x 5m",
        description: "You and up to [P] creatures you’re touching along with everything you and them are wearing or carrying instantly disappear and reappear in an unoccupied space within range. If you try to blink into a space that is occupied, the spell fails and the Natura is lost. If there is enough space at the target location for at least yourself, the spell still takes effect but any target creature that doesn't fit the target space with you is left behind."
    },
    "teleport": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "6 Air",
        range: "[P] x 10km",
        description: "Pick a target location within range that you have either been to before, can see, or that you have an associated object of. An associated object can be anything that has either spent at least a year at the target location or has been there in the last 24 hours.\nYou along with everything you’re wearing or carrying instantly disappear and reappear in an unoccupied space close to the target. If there is no unoccupied space close to the target, the spell fails and the Natura is lost."
    },
    "group teleport": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "10 Air",
        range: "[P] x 10km",
        description: "Pick a target location within range that you have either been to before, can see, or that you have an associated object of. An associated object can be anything that has either spent at least a year at the target location or has been there in the last 24 hours.\nYou and up to [P] creatures you’re touching along with everything you and them are wearing or carrying instantly disappear and reappear in an unoccupied space close to the target. If there is no unoccupied space close to the target, the spell fails and the Natura is lost. If there is enough space at the target location for at least yourself, the spell still takes effect but any target creature that doesn't fit the target space with you is left behind."
    },
    "glow": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "2 Fire",
        description: "An object you touch starts glowing, giving off bright light in a 10m radius and dim light in a 10 m radius beyond that for up to [P] hours or until you end the spell at any point requiring no action. Casting this spell on an object that is already affected by this spell, resets the duration to the new Glow spell’s duration and increases the light radius additively."
    },
    "hex": {
        action: "Minor Reaction",
        components: "Vox",
        natura: "1 Air, 2 Water",
        range: "[P] x 10m",
        description: "When a creature you can see or hear within range makes a test that you’re aware of, you can cast this spell to impose disadvantage on the creature’s roll."
    },
    "stupor": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "3 Earth, 3 Water",
        duration: "1 minute (C)",
        description: "You speak a powerful command at a target creature you can see within range. The target must make a Willpower test against 10 + [P]. On a failure, the target becomes paralyzed for the duration."
    },
    "mindlink": {
        action: "Major Action",
        components: "Motus",
        natura: "5 Air",
        range: "[P]km",
        duration: "5 minutes (C)",
        description: "You create a temporary mental connection between yourself and a creature within range that you have met before. If the creature is willing, the connection is established, allowing you to talk to them telepathically for the duration."
    },
    "silence": {
        action: "Major Action",
        components: "Vox",
        natura: "5 Air",
        duration: "[P] minutes (C)",
        description: "A target creature within range becomes unable to speak, sing, or otherwise make sounds with their mouth."
    },
    "restrain": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "3 Earth",
        range: "10m",
        duration: "1 minute (C)",
        description: "A target creature within range must succeed on a DT 10 + [P] Athletics [BOD] or Evasion test or become restrained by magical chains, vines, or similar, that appear and wrap around it. At the end of each of the target’s turns, it can attempt a DT 10 + [P] Athletics [BOD] test to break free, ending the spell on a success."
    },
    "chain pull": {
        action: "Minor Action",
        components: "Motus",
        natura: "1 Air, 1 Earth",
        range: "[P] x 10m",
        attackType: "Ranged",
        description: "Make a ranged spell attack against a target creature within range. On a hit, the target gets pulled up to [P] x 4m towards you by a magical chain, vine, or similar."
    },
    "air bubble": {
        action: "Major Action",
        components: "Motus",
        natura: "3 Air",
        range: "Touch",
        duration: "[P] hours",
        description: "The target creature’s head is surrounded by a bubble of breathable air for the duration. Gases, smoke, dust, and liquids are kept out of the bubble and the air inside the bubble is always fresh and breathable, no matter the surrounding environment."
    },
    "command": {
        action: "Major Action",
        components: "Vox",
        natura: "5 Air, 1 Fire, 1 Water",
        duration: "[P] minutes",
        saveType: "Willpower",
        saveDTType: "srd",
        description: "You utter a simple command to a target creature that can hear and understand you. The target must succeed on a Willpower test or become charmed by you. While charmed in this way, the target must obey and fulfill the command you uttered when casting the spell to the best of its ability. If the command would result in the target getting hurt, it has advantage on the Willpower test. At the end of each of the target’s turns, it can repeat the Willpower test and end the spell on a success."
    },
    "enthrall": {
        action: "Major Action",
        components: "Vox",
        natura: "10 Air, 3 Fire, 2 Water",
        duration: "[P] hours",
        saveType: "Willpower",
        saveDTType: "srd",
        description: "You utter a command to a target creature that can hear and understand you. The target must succeed on a Willpower test or become charmed by you. While charmed in this way, the target must obey and fulfill the command you uttered when casting the spell to the best of its ability. If the command would result in the target getting hurt, it has advantage on the Willpower test."
    },
    "clean": {
        action: "Minor Action",
        components: "Motus",
        natura: "1 Air",
        range: "10m",
        description: "You magically clean up to [P] creatures of your choice that you can see within range. Their skin, hair, clothes, and equipment are dried and cleaned of any dirt or grime. Alternatively, you can target an area up to [P]m in any dimension and affect all surfaces and objects not worn or carried by creatures inside it in the same way."
    },
    "ignite": {
        action: "Major Action",
        components: "Motus, Vox",
        natura: "3 Fire",
        range: "20m",
        description: "The target object or creature ignites and gains [P] stacks of the burning condition."
    }
};

function DoUpdateSpell(rowId) {
    const prefix = "repeating_spell_" + rowId + "_spell_";

    getAttrs(
        [
            prefix + "name",
            prefix + "natura",
            "essence_air",
            "essence_earth",
            "essence_fire",
            "essence_water",
            "elementalAttunement"
        ],
        function(values) {
            const spellName = values[prefix + "name"] || "";
            const airEssence = parseInt(values["essence_air"]) || 0;
            const earthEssence = parseInt(values["essence_earth"]) || 0;
            const fireEssence = parseInt(values["essence_fire"]) || 0;
            const waterEssence = parseInt(values["essence_water"]) || 0;
            const elementalAttunement = values["elementalAttunement"] || "";
            let naturaString = values[prefix + "natura"] || "";

            const listSpell = SPELLS[spellName.toLowerCase()];
            let attributes = {};

            if(listSpell !== undefined) {
                attributes[prefix + "action"] = (listSpell.action);
                attributes[prefix + "components"] = (listSpell.components);
                attributes[prefix + "natura"] = (listSpell.natura);
                attributes[prefix + "range"] = (listSpell.range);
                attributes[prefix + "area"] = (listSpell.area||"");
                attributes[prefix + "duration"] = (listSpell.duration||"");
                attributes[prefix + "description"] = (listSpell.description);
                attributes[prefix + "attackType"] = (listSpell.attackType||"none");
                attributes[prefix + "saveType"] = (listSpell.saveType||"none");
                attributes[prefix + "saveDTType"] = (listSpell.saveDTType||"");
                attributes[prefix + "damage"] = (listSpell.damage||"");
                
                naturaString = listSpell.natura;
            
                attributes[prefix + "isListItem"] = "on";
            }
            else {
                attributes[prefix + "isListItem"] = "off";
            }

            if(!HasEnoughEssence(naturaString, airEssence, earthEssence, fireEssence, waterEssence, elementalAttunement)) {
                attributes[prefix + "error"] = "Not enough Essence!";
            }
            else {
                attributes[prefix + "error"] = " ";
            }
            
            setAttrs(attributes);
        }
    );
}

export function UpdateSpell(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }
    
    const rowId = eventInfo.sourceAttribute.split("_")[2];

    DoUpdateSpell(rowId);
}

export function UpdateSpells() {
    getSectionIDs("spell", function(ids) {
        for(var i = 0; i < ids.length; i++) {
            DoUpdateSpell(ids[i]);
        }
    });
}

export function UpdateMaxMemorisedSpells() {
    getAttrs(["spellwork", "runecraft", "log"], function(values) {
        const spellwork = parseInt(values.spellwork)||0;
        const runecraft = parseInt(values.runecraft)||0;
        const log = parseInt(values.log)||0;

        let skillRankBonus = spellwork;

        if(runecraft >= 9) {
            skillRankBonus = Math.max(spellwork, runecraft);
        }

        setAttrs({
            "memorisedSpells_max": Math.max(1, log + skillRankBonus)
        });
    });
}

export function UpdateMemorisedSpells() {
    getSectionIDs("spell", function(ids) {
        let memorised = 0;
        setAttrs({
            memorisedSpells: memorised
        });

        for(var i = 0; i < ids.length; i++) {
            const prefix = "repeating_spell_" + ids[i] + "_spell_";

            getAttrs([prefix + "memorised"], function(values) {
                if(values[prefix + "memorised"] == 'on') {
                    memorised++;

                    setAttrs({
                        memorisedSpells: memorised
                    });
                }
            });
        }
    });
}

export function UpdateSRD() {
    getAttrs(
        [
            "wil",
            "spellwork"
        ],
        function(values) {
            const wil = parseInt(values["wil"]) || 0;
            const spellworkRanks = parseInt(values["spellwork"]) || 0;

            let attributes = {};

            attributes["srd"] = 10 + wil + spellworkRanks;

            setAttrs(attributes);
        }
    );
}

export function UpdateSpellSaveDTs() {
    getSectionIDs("spell", function(ids) {
        for(const rowId of ids) {
            DoUpdateSpellSaveDT(rowId);
        }
    });
}

export function UpdateSpellSaveDT(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    DoUpdateSpellSaveDT(rowId);
}

function DoUpdateSpellSaveDT(rowId) {
    const prefix = "repeating_spell_" + rowId + "_spell_";

    const attributes = [
        prefix + "saveDTSkill",
        prefix + "saveDTAttribute",
        prefix + "saveDTBonus"
    ].concat(SKILLS, ATTRIBUTES, ATTRIBUTE_MODS);

    getAttrs(attributes,
        function(values) {
            const skill = values[prefix + "saveDTSkill"] || "";
            const attribute = values[prefix + "saveDTAttribute"] || "";
            const bonus = parseInt(values[prefix + "saveDTBonus"]) || 0;
            const skills = ParseSkills(values);
            const attributeScores = ParseAttributes(values);
            const attributeMods = ParseAttributeMods(values);

            let saveDT = bonus;
            
            if(skill != "-") {
                saveDT += skills[skill.toLowerCase()] || 0;

                if(attribute != "-") {
                    saveDT += attributeMods[attribute.substring(0, 3).toLowerCase()] || 0;
                }
            }
            else if(attribute != "-") {
                saveDT += attributeScores[attribute.toLowerCase()] || 0;
            }

            let attributes = {};
            attributes[prefix + "saveDT"] = saveDT;
            setAttrs(attributes);
        }
    );
}

export function CastSpell(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_spell_" + rowId + "_spell_";

    getAttrs(
        [
            prefix + "name",
            prefix + "action",
            prefix + "components",
            prefix + "natura",
            prefix + "range",
            prefix + "area",
            prefix + "duration",
            prefix + "description",
            prefix + "attackType",
            prefix + "saveType",
            prefix + "saveDT",
            prefix + "saveDTType",
            prefix + "damage",
            "essence_fire",
            "essence_water",
            "essence_earth",
            "essence_air",
            "spellwork",
            "elementalAttunement",
            "stealth",
            "spellworkMod",
            "prayer",
            "faith",
            "miracleworkingFaith"
        ],
        function(values) {
            const name = values[prefix + "name"] || "";
            const action = values[prefix + "action"] || "";
            const components = values[prefix + "components"] || "";
            const natura = values[prefix + "natura"] || "";
            let range = values[prefix + "range"] || "";
            let area = values[prefix + "area"] || "";
            let duration = values[prefix + "duration"] || "";
            let description = values[prefix + "description"] || "";
            const spellworkRanks = parseInt(values["spellwork"]) || 0;
            const stealthRanks = parseInt(values["stealth"]) || 0;
            const spellworkMod = values["spellworkMod"] || "";

            const attackType = values[prefix + "attackType"] || "";
            const saveType = values[prefix + "saveType"] || "";
            const saveDT = values[prefix + "saveDT"] || "";
            const saveDTType = values[prefix + "saveDTType"] || "";
            const damage = values[prefix + "damage"] || "";
            
            const fireEssence = parseInt(values["essence_fire"]) || 0;
            const waterEssence = parseInt(values["essence_water"]) || 0;
            const earthEssence = parseInt(values["essence_earth"]) || 0;
            const airEssence = parseInt(values["essence_air"]) || 0;

            const elementalAttunement = values["elementalAttunement"] || "";
            
            const prayer = parseInt(values["prayer"]) || 0;
            let faith = parseInt(values["faith"]) || 0;
            let miracleworkingFaith = parseInt(values["miracleworkingFaith"]) || 0;
            
            let naturaCosts = {
                air: 0,
                earth: 0,
                fire: 0,
                water: 0
            };

            // Parse Natura field
            if(natura != "") {
                naturaCosts = ParseNatura(natura, elementalAttunement);
            }

            // Cast Spell
            if(fireEssence >= naturaCosts.fire
                && waterEssence >= naturaCosts.water
                && earthEssence >= naturaCosts.earth
                && airEssence >= naturaCosts.air)
            {
                let rollString = CUSTOM_TEMPLATE_BEGINNING;

                // Name
                rollString += `{{name=${name}}}`;
                // Action
                rollString += `{{action=${action}}}`;
                // Components
                rollString += `{{components=${components}}}`;
                // Power
                let power = spellworkRanks;

                // Miracle Working
                if(prayer >= 2 && miracleworkingFaith > 0) {
                    power += miracleworkingFaith;
                    rollString += `{{power=[[${spellworkRanks}[Spellwork]+${miracleworkingFaith}[Miracle Working]]]}}`;
                }
                else {
                    miracleworkingFaith = 0;
                    rollString += `{{power=[[${spellworkRanks}[Spellwork]]]}}`;
                }

                // Range
                if(range != "") {
                    range = range.replaceAll("[P]", `[[${power}[Power]]]`);
                    rollString += `{{range=${range}}}`;
                }
                // Area
                if(area != "") {
                    area = area.replaceAll("[P]", `[[${power}[Power]]]`);
                    rollString += `{{area=${area}}}`;
                }
                // Duration
                if(duration != "") {
                    duration = duration.replaceAll("[P]", `[[${power}[Power]]]`);
                    rollString += `{{duration=${duration}}}`;
                }
                // Attack
                if(attackType != "none") {
                    rollString += GetCustomTemplateAtkString(spellworkMod);
                }
                // Save
                if(saveType != "none") {
                    if(saveDTType.toLowerCase() == "srd") {
                        rollString += `{{save=DT @{srd} ${saveType} Test}}`;
                    }
                    else {
                        rollString += `{{save=DT ${saveDT} ${saveType} Test}}`;
                    }
                }

                // Damage
                if(damage != "") {
                    const isAttack = attackType != "none";
                    const powerAdjustedDamage = damage.replaceAll("[P]", power);
                    rollString += DamageStringToTemplateRollString(powerAdjustedDamage, isAttack, stealthRanks);
                }

                // Description
                if(description != "") {
                    description = description.replaceAll("[P]", `[[${power}[Power]]]`);
                    rollString += `{{description=${description}}}`;
                }
                
                startRoll(rollString, (r) => {
                    setAttrs({
                        essence_fire: fireEssence - naturaCosts.fire,
                        essence_water: waterEssence - naturaCosts.water,
                        essence_earth: earthEssence - naturaCosts.earth,
                        essence_air: airEssence - naturaCosts.air
                    });

                    // Miracle Working
                    if(prayer >= 2) {
                        faith -= miracleworkingFaith;
                    }

                    setAttrs({
                        "faith": faith
                    });

                    finishRoll(r.rollId);
                });
            }
            else {
                // Can't cast spell!
                console.error(`Can't cast ${name}! Not enough Essence available.`);
            }
        }
    );
}