/**
 * @type {Object.<string, string>}
 */
const POSITIVE_QUALITY_DESCRIPTIONS = {
    "agile": "You gain a +2 bonus on all Agility tests.\nThis quality is incompatible with Clumsy.",
    "ambidextrous": "While dual-wielding, you can benefit from Extra Attacks of your off-hand weapon. If both weapons would give you Extra Attacks, only the one that gives you more attacks applies.\nYou lose these benefits if you lose a hand or arm until it is restored or replaced.",
    "analytical mind": "You gain a +2 bonus on all Logic tests.\nThis quality is incompatible with Dull.",
    "educated": "At Level 1, you gain a +1 bonus on all Knowledge skill tests. This bonus increases by +1 for each Level of Educated after 1.\nAt Level 2, whenever you fail a knowledge skill test made to recall information, you at least know where to find the information you’re missing, provided you have at least 1 Rank in the skill.\nAt Level 3, you have advantage on knowledge skill tests made to recall information if you have at least 1 Rank in the skill.",
    "eidetic memory": "At Level 1, you can accurately recall anything you have experienced within the last 24 hours.\nAt Level 2, you can accurately recall anything you have experienced within the last month.\nAt Level 3, you can accurately recall anything you have experienced within the last year.",
    "elemental attunement (water)": "You can choose this quality only once and have to select one of the 4 elements: Water, Earth, Fire, Air.\nWhen you expend essence of the chosen element, you need one less essence of that element and the complexity of any formula using this essence is also one less for you.",
    "elemental attunement (earth)": "You can choose this quality only once and have to select one of the 4 elements: Water, Earth, Fire, Air.\nWhen you expend essence of the chosen element, you need one less essence of that element and the complexity of any formula using this essence is also one less for you.",
    "elemental attunement (fire)": "You can choose this quality only once and have to select one of the 4 elements: Water, Earth, Fire, Air.\nWhen you expend essence of the chosen element, you need one less essence of that element and the complexity of any formula using this essence is also one less for you.",
    "elemental attunement (air)": "You can choose this quality only once and have to select one of the 4 elements: Water, Earth, Fire, Air.\nWhen you expend essence of the chosen element, you need one less essence of that element and the complexity of any formula using this essence is also one less for you.",
    "empathetic": "You gain a +2 bonus on all Intuition tests made to judge the intentions or emotional state of another creature, for example when trying to tell if they’re telling the truth.\nThis quality is incompatible with Callous.",
    "essence sensitivity": "At Level 1, you can spend 10 minutes examining an unprocessed object (like a plant, a piece of rock or crystal, or an animal part) to find out what Essence could be extracted from it, if any.\nAt Level 2, you have Advantage on Evasion and Willpower tests against spells, curses and magical effects.\nAt Level 3, you have advantage on Spellwork, Runecraft, and Alchemy tests made to experiment for formulae and recipes.",
    "fast": "Your movement speed increases by 2m for each level of Fast.\nThis quality is incompatible with Slow.",
    "pious": "You have advantage on Prayer tests other than attacks and Mythology tests related to your own religion.",
    "quick reflexes": "You gain a +2 bonus on all Evasion tests.",
    "sniper": "Your ranged weapon attacks ignore half and three-quarters cover.\nIn addition, when you aim at specific body parts with ranged weapons, you ignore the target’s Shield Armor bonus on a hit.",
    "sharpshooter": "Attacking at long range doesn’t impose disadvantage on your attack.",
    "tough": "Your maximum hit points increase by your character level for each level of Tough.\nAt Tough Level 3, when you take a Breather, you gain the benefits of a Short Rest.\nThis quality is incompatible with Fragile.",
    "weapon expert": "You can take this quality multiple times, but every time you have to choose a different type of weapon.\nYou gain a +2 bonus to the attack and damage when attacking with the chosen weapon type.",
    "sneaky": "You gain a +2 bonus to Stealth tests and can attempt to hide even when only lightly obscured.",
    "inspiring presence": "You and friendly creatures within 10m gain a +2 bonus to Willpower tests.",
    "strong": "You gain a +2 bonus to Athletics tests and your carry capacity doubles.\nThis quality is incompatible with Weak.",
    "silver tongue": "You gain a +2 bonus on all Charisma tests.\nThis quality is incompatible with Socially Inept."
};

function AddPositiveQuality(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_positiveQuality_" + rowId + "_";

    const newQuality = eventInfo.newValue;
    const description = POSITIVE_QUALITY_DESCRIPTIONS[newQuality.toLowerCase()];
    
    let attributes = {};

    if(description !== undefined) {
        attributes[prefix + "positiveQuality_description"] = description;
    }

    attributes.elementalAttunement = "";

    switch(newQuality.toLowerCase()) {
        case "agile":
            attributes.agileBonus = "+2";
            break;
        case "analytical mind":
            attributes.analyticalMindBonus = "+2";
            break;
        case "educated":
            UpdatePositiveQualityLevel(eventInfo);
            break;
        case "quick reflexes":
            attributes.quickReflexesBonus = "+2";
            break;
        case "tough":
            UpdatePositiveQualityLevel(eventInfo);
            break;
        case "sneaky":
            attributes.sneakyBonus = "+2";
            break;
        case "inspiring presence":
            attributes.inspiringPresenceBonus = "+2";
            break;
        case "strong":
            attributes.strongBonus = "+2";
            break;
        case "silver tongue":
            attributes.silverTongueBonus = "+2";
            break;
        case "elemental attunement (air)":
            attributes.elementalAttunement = "air";
            break;
        case "elemental attunement (earth)":
            attributes.elementalAttunement = "earth";
            break;
        case "elemental attunement (fire)":
            attributes.elementalAttunement = "fire";
            break;
        case "elemental attunement (water)":
            attributes.elementalAttunement = "water";
            break;
    }
    
    setAttrs(attributes);
}

export function RemovePositiveQuality(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_positivequality_" + rowId + "_";

    let oldQuality = eventInfo.previousValue;
    if(eventInfo.triggerName.startsWith("remove:")) {
        oldQuality = eventInfo.removedInfo[prefix + "positiveQuality_name"];
    }

    if(oldQuality === undefined) {
        return;
    }

    let attributes = {};

    switch(oldQuality.toLowerCase()) {
        case "agile":
            attributes.agileBonus = "";
            break;
        case "analytical mind":
            attributes.analyticalMindBonus = "";
            break;
        case "educated":
            attributes.educatedBonus = "";
            break;
        case "quick reflexes":
            attributes.quickReflexesBonus = "";
            break;
        case "tough":
            attributes.toughBonus = "";
            break;
        case "sneaky":
            attributes.sneakyBonus = "";
            break;
        case "inspiring presence":
            attributes.inspiringPresenceBonus = "";
            break;
        case "strong":
            attributes.strongBonus = "";
            break;
        case "silver tongue":
            attributes.silverTongueBonus = "";
            break;
        case "elemental attunement (air)":
            attributes.elementalAttunement = "";
            break;
        case "elemental attunement (earth)":
            attributes.elementalAttunement = "";
            break;
        case "elemental attunement (fire)":
            attributes.elementalAttunement = "";
            break;
        case "elemental attunement (water)":
            attributes.elementalAttunement = "";
            break;
    }
    
    setAttrs(attributes);
}

export function UpdatePositiveQualityLevel(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_positivequality_" + rowId + "_";
    
    getAttrs([prefix + "positiveQuality_name", prefix + "positiveQuality_level"], function(values) {
        const quality = values[prefix + "positiveQuality_name"] || "";
        const level = parseInt(values[prefix + "positiveQuality_level"]) || 0;

        switch(quality.toLowerCase()) {
            case "educated":
                setAttrs({
                    educatedBonus: level
                });
                break;
            case "tough":
                setAttrs({
                    toughBonus: level
                });
                break;
        }
    });
}

export function UpdatePositiveQuality(eventInfo) {
    const oldQuality = eventInfo.previousValue;

    if(oldQuality !== undefined) {
        RemovePositiveQuality(eventInfo);
    }

    const newQuality = eventInfo.newValue;
    
    if(newQuality !== undefined) {
        AddPositiveQuality(eventInfo);
    }
}