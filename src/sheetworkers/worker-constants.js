/**
 * @type {string}
 */
export const TEST_TYPE_PROMPT = "?{Roll Type|Normal,[[1d20]]|Advantage,{[[1d20]]&#44;[[1d20]]&#125;kh1|Disadvantage,{[[1d20]]&#44;[[1d20]]&#125;kl1}";

/**
 * @type {string}
 */
export const CUSTOM_TEMPLATE_BEGINNING = `?{Secret|Open,|Secret,/w gm} &{template:custom}`;

/**
 * @type {string[]}
 */
export const SKILLS = [
    "athletics",
    "perception",
    "piloting",
    "stealth",
    "artisanship",
    "deception",
    "intimidation",
    "performance",
    "persuasion",
    "astronomy",
    "economy",
    "history",
    "literature",
    "medicine",
    "mythology",
    "nature",
    "survival",
    "clockworkmechanics",
    "automachinery",
    "augmentation",
    "gunsmithing",
    "tinkering",
    "vehiclemechanics",
    "alchemy",
    "prayer",
    "spellwork",
    "runecraft",
    "summoning",
    "artillery",
    "brawling",
    "bow",
    "pistol",
    "rifle",
    "shield",
    "onehandedmelee",
    "twohandedmelee"
];

/**
 * @type {string[]}
 */
export const ATTRIBUTES = [
    "agility",
    "body",
    "charisma",
    "intuition",
    "logic",
    "willpower"
];

/**
 * @type {string[]}
 */
export const ATTRIBUTE_MODS = [
    "agi",
    "bod",
    "cha",
    "int",
    "log",
    "wil"
];