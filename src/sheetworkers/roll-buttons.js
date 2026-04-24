import { GetCustomTemplateResultString } from './helpers';
import {CUSTOM_TEMPLATE_BEGINNING} from './worker-constants';

/**
 * @typedef {Object} SkillInfo
 * @property {string} mod
 * @property {string} name
 * @property {string} attribute
 */

/**
 * @type {Object.<string, string>}
 */
const ATTRIBUTE_MOD_NAMES = {
    "agi": "Agility",
    "bod": "Body",
    "cha": "Charisma",
    "int": "Intuition",
    "log": "Logic",
    "wil": "Willpower"
};

/**
 * @type {Object.<string, SkillInfo>}
 */
const SKILL_MOD_NAMES_ATTRIBUTES = {
    "athletics": {
        mod: "athleticsMod",
        name: "Athletics",
        attribute: "BOD"
    },
    "perception": {
        mod: "perceptionMod",
        name: "Perception",
        attribute: "INT"
    },
    "piloting": {
        mod: "pilotingMod",
        name: "Piloting",
        attribute: "AGI"
    },
    "stealth": {
        mod: "stealthMod",
        name: "Stealth",
        attribute: "AGI"
    },
    "artisanship": {
        mod: "artisanshipMod",
        name: "Artisanship",
        attribute: "AGI"
    },
    "deception": {
        mod: "deceptionMod",
        name: "Deception",
        attribute: "CHA"
    },
    "intimidation": {
        mod: "intimidationMod",
        name: "Intimidation",
        attribute: "CHA"
    },
    "performance": {
        mod: "performanceMod",
        name: "Performance",
        attribute: "CHA"
    },
    "persuasion": {
        mod: "persuasionMod",
        name: "Persuasion",
        attribute: "CHA"
    },
    "astronomy": {
        mod: "astronomyMod",
        name: "Astronomy",
        attribute: "LOG"
    },
    "economy": {
        mod: "economyMod",
        name: "Economy",
        attribute: "LOG"
    },
    "history": {
        mod: "historyMod",
        name: "History",
        attribute: "LOG"
    },
    "literature": {
        mod: "literatureMod",
        name: "Literature",
        attribute: "LOG"
    },
    "medicine": {
        mod: "medicineMod",
        name: "Medicine",
        attribute: "LOG"
    },
    "mythology": {
        mod: "mythologyMod",
        name: "Mythology",
        attribute: "LOG"
    },
    "nature": {
        mod: "natureMod",
        name: "Nature",
        attribute: "LOG"
    },
    "survival": {
        mod: "survivalMod",
        name: "Survival",
        attribute: "INT"
    },
    "clockworkmechanics": {
        mod: "clockworkmechanicsMod",
        name: "Clockwork Mechanics",
        attribute: "LOG"
    },
    "automachinery": {
        mod: "automachineryMod",
        name: "Automachinery",
        attribute: "LOG"
    },
    "augmentation": {
        mod: "augmentationMod",
        name: "Augmentation",
        attribute: "LOG"
    },
    "gunsmithing": {
        mod: "gunsmithingMod",
        name: "Gunsmithing",
        attribute: "AGI"
    },
    "tinkering": {
        mod: "tinkeringMod",
        name: "Tinkering",
        attribute: "AGI"
    },
    "vehiclemechanics": {
        mod: "vehiclemechanicsMod",
        name: "Vehicle Mechanics",
        attribute: "BOD"
    },
    "alchemy": {
        mod: "alchemyMod",
        name: "Alchemy",
        attribute: "LOG"
    },
    "prayer": {
        mod: "prayerMod",
        name: "Prayer",
        attribute: "WIL"
    },
    "spellwork": {
        mod: "spellworkMod",
        name: "Spellwork",
        attribute: "WIL"
    },
    "runecraft": {
        mod: "runecraftMod",
        name: "Runecraft",
        attribute: "LOG"
    },
    "summoning": {
        mod: "summoningMod",
        name: "Summoning",
        attribute: "WIL"
    },
    "artillery": {
        mod: "artilleryMod",
        name: "Artillery",
        attribute: "AGI"
    },
    "brawling": {
        mod: "brawlingMod",
        name: "Brawling",
        attribute: "AGI"
    },
    "bow": {
        mod: "bowMod",
        name: "Bow",
        attribute: "AGI"
    },
    "pistol": {
        mod: "pistolMod",
        name: "Pistol",
        attribute: "AGI"
    },
    "rifle": {
        mod: "rifleMod",
        name: "Rifle",
        attribute: "AGI"
    },
    "shield": {
        mod: "shieldMod",
        name: "Shield",
        attribute: "BOD"
    },
    "onehandedmelee": {
        mod: "onehandedmeleeMod",
        name: "One-Handed Melee",
        attribute: "AGI"
    },
    "twohandedmelee": {
        mod: "twohandedmeleeMod",
        name: "Two-Handed Melee",
        attribute: "BOD"
    }
};

// Custom Sheet Roll Buttons
for(const mod of Object.keys(ATTRIBUTE_MOD_NAMES)) {
    on(`clicked:${mod}`, function() {
        let rollString = `${CUSTOM_TEMPLATE_BEGINNING}{{name=${ATTRIBUTE_MOD_NAMES[mod]} Test [@{${mod}}]}} `;
        rollString += GetCustomTemplateResultString(`@{${mod}}`);
        startRoll(rollString, r => {
            finishRoll(r.rollId);
        });
    });
}

for(const skill of Object.keys(SKILL_MOD_NAMES_ATTRIBUTES)) {
    const mna = SKILL_MOD_NAMES_ATTRIBUTES[skill];
    on(`clicked:${skill}`, function() {
        let rollString = `${CUSTOM_TEMPLATE_BEGINNING}{{name=${mna.name} [${mna.attribute}] Test [@{${mna.mod}}]}} `;
        rollString += GetCustomTemplateResultString(`@{${mna.mod}}`);
        startRoll(rollString, r => {
            finishRoll(r.rollId);
        });
    });
}