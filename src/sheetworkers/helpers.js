import { ATTRIBUTE_MODS, ATTRIBUTES, SKILLS } from "./worker-constants";

/**
 * @type {Object.<string, string>}
 */
const DAMAGE_TYPES = {
    "blunt": "&#x1F528;",
    "slashing": "&#x1F52A;",
    "piercing": "&#x27B6;",
    "fire": "&#x1F525;",
    "cold": "&#x2744;",
    "electrical": "&#x26A1;",
    "acid": "&#x1F9EA;",
    "poison": "&#x2620;"
};

/**
 * 
 * @param {string} mod 
 * @param {boolean} isInitiative 
 * @returns {string}
 */
export function GetCustomTemplateResultString(mod, isInitiative) {
    const initiativeString = isInitiative ? "&{tracker&#125;" : "";
    return `?{Roll Type|` +
        `Normal,[[1d20${mod}${initiativeString}]] {{result1=$[[0]]&#125;&#125;|` +
        `Advantage,[[{[[1d20${mod}]]&#44;[[1d20${mod}]]&#125;kh1${initiativeString}]] {{result1=$[[0]]&#125;&#125; {{result2=$[[1]]&#125;&#125; {{resadvflag=[[1]]&#125;&#125;|` +
        `Disadvantage,[[{[[1d20${mod}]]&#44;[[1d20${mod}]]&#125;kl1${initiativeString}]] {{result1=$[[0]]&#125;&#125; {{result2=$[[1]]&#125;&#125; {{resdisadvflag=[[1]]&#125;&#125;}`;
}

/**
 * Replaces the given damage type with its corresponding emoji if there is one.
 * Returns the damage type if there is no emoji for it.
 * @param {string} damageType 
 * @returns {string}
 */
export function DamageTypeEmoji(damageType) {
    const lcDamageType = damageType.toLowerCase();
    if(DAMAGE_TYPES[lcDamageType]) {
        return DAMAGE_TYPES[lcDamageType];
    }
    
    return CapitalizeFirstLetter(damageType);
}

/**
 * 
 * @param {string} mod 
 * @returns {string}
 */
export function GetCustomTemplateAtkString(mod) {
    return `?{Roll Type|` +
        `Normal,[[1d20${mod}]] {{atk=$[[0]]&#125;&#125;|` +
        `Advantage,[[{[[1d20${mod}]]&#44;[[1d20${mod}]]&#125;kh1]] {{atk=$[[0]]&#125;&#125; {{atkadvantage=$[[1]]&#125;&#125; {{advflag=[[1]]&#125;&#125;|` +
        `Disadvantage,[[{[[1d20${mod}]]&#44;[[1d20${mod}]]&#125;kl1]] {{atk=$[[0]]&#125;&#125; {{atkadvantage=$[[1]]&#125;&#125; {{disadvflag=[[1]]&#125;&#125;}`;
}

/**
 * 
 * @param {string} naturaString 
 * @param {number} airEssence 
 * @param {number} earthEssence 
 * @param {number} fireEssence 
 * @param {number} waterEssence 
 * @param {string} elementalAttunement 
 * @returns {boolean}
 */
export function HasEnoughEssence(naturaString, airEssence, earthEssence, fireEssence, waterEssence, elementalAttunement) {
    return EnoughEssenceForQuantity(naturaString, airEssence, earthEssence, fireEssence, waterEssence, elementalAttunement) > 0;
}

/**
 * 
 * @param {string} naturaString 
 * @param {number} airEssence 
 * @param {number} earthEssence 
 * @param {number} fireEssence 
 * @param {number} waterEssence 
 * @param {string} elementalAttunement 
 * @returns {number}
 */
export function EnoughEssenceForQuantity(naturaString, airEssence, earthEssence, fireEssence, waterEssence, elementalAttunement) {
    const naturaCosts = ParseNatura(naturaString, elementalAttunement);

    let quantity = Number.POSITIVE_INFINITY;

    if(naturaCosts.fire > 0) {
        quantity = Math.min(quantity, Math.floor(fireEssence / naturaCosts.fire));
    }

    if(naturaCosts.water > 0) {
        quantity = Math.min(quantity, Math.floor(waterEssence / naturaCosts.water));
    }

    if(naturaCosts.earth > 0) {
        quantity = Math.min(quantity, Math.floor(earthEssence / naturaCosts.earth));
    }

    if(naturaCosts.air > 0) {
        quantity = Math.min(quantity, Math.floor(airEssence / naturaCosts.air));
    }

    return quantity;
}

/**
 * 
 * @param {string} damage 
 * @param {bool} isAttack 
 * @param {number} stealthRanks 
 * @param {bool} damageAddsBOD 
 * @param {number} athleticsRanks 
 * @param {string} weaponSkill 
 * @param {number} artilleryRanks 
 * @param {number} augmentationRanks 
 * @returns {string}
 */
export function DamageStringToTemplateRollString(damage, isAttack, stealthRanks, damageAddsBOD, athleticsRanks, weaponSkill, artilleryRanks, augmentationRanks) {
    let rollString = "";
    const damagePartRegex = /((?:(?:[+-]?\d+d\d+(?:\[[a-z\s]*\])*)|(?:[+-]?\d+(?:\[[a-z\s]*\])*))+)\s((?:[a-z]+(?:\s[a-z])*)+)/gi;
    const damageParts = damage.match(damagePartRegex);

    let damageRolls = {};
    let critDamageRolls = {};
    let baseDamageType = "";

    if(!!damageParts && !!damageParts.length) {
        for(let i = 0; i < damageParts.length; i++) {
            const regexResult = damageParts[i].match(/((?:(?:[+-]?\d+d\d+(?:\[[a-z\s]*\])*)|(?:[+-]?\d+(?:\[[a-z\s]*\])*))+)\s((?:[a-z]+(?:\s[a-z])*)+)/i);
            const damageAmount = regexResult[1];
            const damageType = regexResult[2].toLowerCase();

            if(i === 0) {
                baseDamageType = damageType;
            }
            
            if(damageRolls[damageType] === undefined) {
                damageRolls[damageType] = `${damageAmount}`;
            }
            else {
                let plusSign = !damageAmount.startsWith("-") ? "+" : "";
                damageRolls[damageType] += `${plusSign}${damageAmount}`;
            }
            
            // Crit
            const diceRegex = /[+-]?\d+d\d+/gi;
            const damageDice = damageAmount.match(diceRegex);

            if(!!damageDice && !!damageDice.length) {
                if(critDamageRolls[damageType] === undefined) {
                    critDamageRolls[damageType] = "";
                    
                    for(let j = 0; j < damageDice.length; j++) {
                        let plusSign = !damageDice[j].startsWith("-") && !damageDice[j].startsWith("+") && j>0 ? "+" : "";
                        critDamageRolls[damageType] += `${plusSign}${damageDice[j]}`;
                    }
                }
                else {
                    for(let j = 0; j <= damageDice.length; j++) {
                        let plusSign = !damageDice[j].startsWith("-") && !damageDice[j].startsWith("+") ? "+" : "";
                        critDamageRolls[damageType] += `${plusSign}${damageDice[j]}`;
                    }
                }
            }
        }
    }

    rollString += `{{damage=`;
    for(const damageType in damageRolls) {
        rollString += ` [[${damageRolls[damageType]}]] ${DamageTypeEmoji(damageType)}`;
    }
    rollString += `}}`;

    rollString += `{{critdamage=`;
    for(const damageType in critDamageRolls) {
        rollString += ` +[[${critDamageRolls[damageType]}]] ${DamageTypeEmoji(damageType)}`;
    }
    rollString += `}}`;

    if(isAttack) {
        // Sneak Attack
        if(stealthRanks >= 3) {
            let sneakAttackDamage;
            const sneakAttackDice = Math.floor(stealthRanks / 3);
            if(stealthRanks < 10) {
                sneakAttackDamage = sneakAttackDice + "d6";
            }
            else {
                sneakAttackDamage = sneakAttackDice + "d8";
            }
            rollString += `{{sneakattack=+[[${sneakAttackDamage}]] ${DamageTypeEmoji(baseDamageType)}}}`;
            rollString += `{{sneakattackcrit=+[[${sneakAttackDamage}]] ${DamageTypeEmoji(baseDamageType)}}}`;
        }

        // Powerful Strikes
        if(damageAddsBOD && athleticsRanks > 0) {
            rollString += `{{powerfulstrikes=+[[${athleticsRanks}]] ${baseDamageType ? DamageTypeEmoji(baseDamageType) : DamageTypeEmoji("blunt")}}}`;
        }

        // Powered Strikes
        if(weaponSkill == "Brawling" && augmentationRanks > 4) {
            rollString += `{{poweredstrikes=+[[${Math.floor(augmentationRanks/5)}d6]] ${DamageTypeEmoji("blunt")}}}`;
            rollString += `{{poweredstrikescrit=+[[${Math.floor(augmentationRanks/5)}d6]] ${DamageTypeEmoji("blunt")}}}`;
        }

        // Siege Weapons
        if(weaponSkill == "Artillery" && artilleryRanks >= 7) {
            rollString += `{{siegeweapon=+[[${artilleryRanks}d6]] ${DamageTypeEmoji("piercing")}}}`;
            rollString += `{{siegeweaponcrit=+[[${artilleryRanks}d6]] ${DamageTypeEmoji("piercing")}}}`;
        }
    }

    return rollString;
}

/**
 * 
 * @param {string} natura 
 * @param {string} elementalAttunement 
 * @param {number | undefined} quantity 
 * @returns {{air: number, earth: number, fire: number, water: number}}
 */
export function ParseNatura(natura, elementalAttunement, quantity) {
    const naturaRegex = /[+-]?\d*\s(?:Fire|Air|Earth|Water)/gi;
    const matches = natura.match(naturaRegex);
    let fireCost = 0;
    let waterCost = 0;
    let earthCost = 0;
    let airCost = 0;
    quantity = quantity || 1;

    if(matches != undefined) {
        for(const match of matches) {
            const splitMatch = match.split(" ");
            const amount = parseInt(splitMatch[0]);
            const element = splitMatch[1];

            switch(element.toLowerCase()) {
                case "fire":
                    fireCost += amount;
                    break;
                case "water":
                    waterCost += amount;
                    break;
                case "earth":
                    earthCost += amount;
                    break;
                case "air":
                    airCost += amount;
                    break;
            }
        }
    }

    // Elemental Attunement
    if(elementalAttunement.toLowerCase() == "fire") {
        fireCost = Math.max(0, fireCost-1);
    }
    if(elementalAttunement.toLowerCase() == "water") {
        waterCost = Math.max(0, waterCost-1);
    }
    if(elementalAttunement.toLowerCase() == "earth") {
        earthCost = Math.max(0, earthCost-1);
    }
    if(elementalAttunement.toLowerCase() == "air") {
        airCost = Math.max(0, airCost-1);
    }

    return {
        air: airCost * quantity,
        earth: earthCost * quantity,
        fire: fireCost * quantity,
        water: waterCost * quantity
    };
}

/**
 * Returns a signed string representation of the number.
 * @param {number} n
 * @returns {string}
 */
export function Signed(n) {
    return (n<0?"":"+") + n;
}

/**
 * Calculates how many slots are taken up by a given count of items with a given size.
 * @param {string} size 
 * @param {number} count 
 * @returns {number}
 */
export function CalculateSlots(size, count) {
    let sizeParts = size.split("/");

    if(sizeParts.length > 1) {
        let slotsPerStack = parseInt(sizeParts[0]) || 0;
        let maxCountPerStack = parseInt(sizeParts[1]) || 1;

        return Math.ceil(count / maxCountPerStack) * slotsPerStack;
    }

    return (parseInt(sizeParts[0]) || 0) * count;
}

/**
 * Extracts and parses all skill values from a given set of values.
 * @param {object} values 
 * @returns {Object.<string, number>} Parsed number values of all skills extracted from the given values object into a new object.
 */
export function ParseSkills(values) {
    let skills = {};

    for(const skill of SKILLS) {
        skills[skill] = parseInt(values[skill]) || 0;
    }

    return skills;
}

/**
 * Extracts and parses all attribute values from a given set of values.
 * @param {object} values 
 * @returns {Object.<string, number>} Parsed number values of all attributes extracted from the given values object into a new object.
 */
export function ParseAttributes(values) {
    let attributes = {};

    for(const attribute of ATTRIBUTES) {
        attributes[attribute] = parseInt(values[attribute]) || 0;
    }

    return attributes;
}

/**
 * Extracts and parses all attribute mod values from a given set of values.
 * @param {object} values 
 * @returns {Object.<string, number>} Parsed number values of all attribute mods extracted from the given values object into a new object.
 */
export function ParseAttributeMods(values) {
    let attributeMods = {};

    for(const mod of ATTRIBUTE_MODS) {
        attributeMods[mod] = parseInt(values[mod]) || 0;
    }

    return attributeMods;
}

/**
 * Capitalizes the first letter of a given string.
 * @param {string | undefined} str 
 * @returns {string}
 */
export function CapitalizeFirstLetter(str) {
  if (!str || str == "") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}