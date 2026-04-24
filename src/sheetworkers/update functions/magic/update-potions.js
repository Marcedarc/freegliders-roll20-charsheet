import { EnoughEssenceForQuantity, ParseNatura } from "../../helpers";
import { CUSTOM_TEMPLATE_BEGINNING } from "../../worker-constants";

/**
 * @typedef {Object} Potion
 * @property {string} essence
 * @property {string} effect
 */

/**
 * @type {Object<string, Potion>}
 */
const POTIONS = {
    "healing": {
        essence: "2 Water, 2 Fire, 2 Earth, 2 Air",
        effect: "Restores [P]d4 hit points."
    },
    "cleansing": {
        essence: "3 Water, 3 Earth",
        effect: "Cures all stacks of poison."
    },
    "haste": {
        essence: "2 Fire, 3 Air",
        effect: "Grants +1 Minor Action each turn for [P] turns."
    },
    "restoration": {
        essence: "5 Earth",
        effect: "At the start of your turn, you regain 1d4 hit points for the next [P] turns."
    },
    "water breathing": {
        essence: "3 Water, 2 Air",
        effect: "For the next [P] hours, you can breathe underwater."
    },
    "flight": {
        essence: "6 Air",
        effect: "For the next [P] minutes, you can fly with a speed equal to your walking speed."
    },
    "charm": {
        essence: "3 Water, 2 Fire",
        effect: "For the next [P] hours, you have advantage on Persuasion tests."
    },
    "muscle": {
        essence: "1 Fire, 4 Earth",
        effect: "For the next [P] hours, you have advantage on Athletics tests."
    },
    "fire immunity": {
        essence: "6 Water",
        effect: "For the next [P] minutes, you are immune to Fire damage."
    },
    "lightning immunity": {
        essence: "6 Earth",
        effect: "For the next [P] minutes, you are immune to Lightning damage."
    },
    "acid immunity": {
        essence: "3 Earth, 3 Water",
        effect: "For the next [P] minutes, you are immune to Acid damage."
    },
    "poison immunity": {
        essence: "3 Earth, 3 Water",
        effect: "For the next [P] minutes, you are immune to Poison damage. You can still gain additional poison stacks."
    },
    "hardening": {
        essence: "6 Earth",
        effect: "For the next minute, you gain a +[P] bonus to all your Armor Values."
    },
    "night vision": {
        essence: "1 Water, 3 Fire, 1 Air",
        effect: "For the next [P] hours, you can see in dim light as if it was bright light and in total darkness as if it were dim light."
    },
    "explosion": {
        essence: "6 Fire",
        effect: "When this potion is thrown, it explodes in a 10m radius sphere, dealing [P]d6 Fire damage to creatures and objects in the area."
    },
    "last stand": {
        essence: "2 Water, 4 Fire, 2 Earth, 2 Air",
        effect: "For the next minute, if damage from any source other than a critical or deadly hit would reduce you to 0 hit points, you keep 1 hit point. At the end of that minute, if you’re at 1 hit point still, you immediately drop unconscious."
    },
    "wound closure": {
        essence: "4 Water, 1 Fire, 1 Earth",
        effect: "Cures all stacks of bleeding."
    }
};

export function UpdatePotion(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }
    
    const rowId = eventInfo.sourceAttribute.split("_")[2];

    DoUpdatePotion(rowId);
}

export function UpdatePotions() {
    getSectionIDs("potion", function(ids) {
        for(var i = 0; i < ids.length; i++) {
            DoUpdatePotion(ids[i]);
        }
    });
}

function DoUpdatePotion(rowId) {
    const prefix = "repeating_potion_" + rowId + "_potion_";

    getAttrs(
        [
            prefix + "name",
            prefix + "essence",
            prefix + "batch",
            "essence_fire",
            "essence_water",
            "essence_earth",
            "essence_air",
            "elementalAttunement",
            "alchemy"
        ],
        function(values) {
            const potionName = values[prefix + "name"] || "";
            let naturaString = values[prefix + "essence"] || "";
            const alchemyRanks = parseInt(values["alchemy"]) || 0;
            const batchSize = parseInt(values[prefix + "batch"]) || 0;
            
            const fireEssence = parseInt(values["essence_fire"]) || 0;
            const waterEssence = parseInt(values["essence_water"]) || 0;
            const earthEssence = parseInt(values["essence_earth"]) || 0;
            const airEssence = parseInt(values["essence_air"]) || 0;

            const elementalAttunement = values["elementalAttunement"] || "";
            
            let attributes = {};

            const listPotion = POTIONS[potionName.toLowerCase()];
            if(listPotion !== undefined) {
                attributes[prefix + "essence"] = listPotion.essence;
                attributes[prefix + "effect"] = listPotion.effect;
                
                naturaString = listPotion.essence;
                
                attributes[prefix + "isListItem"] = "on";
            }
            else {
                attributes[prefix + "isListItem"] = "off";
            }

            const essenceForQuantity = EnoughEssenceForQuantity(naturaString, airEssence, earthEssence, fireEssence, waterEssence, elementalAttunement);
            attributes[prefix + "batch_max"] = essenceForQuantity;
            attributes[prefix + "batch"] = Math.min(batchSize, essenceForQuantity);
            
            attributes[prefix + "canBrew"] = "on";

            if(alchemyRanks < 3) {
                attributes[prefix + "error"] = " ";
                attributes[prefix + "canBrew"] = "off";
            }else if(essenceForQuantity < 1) {
                attributes[prefix + "error"] = "Not enough Essence!";
            }
            else {
                attributes[prefix + "error"] = " ";
            }

            setAttrs(attributes);
        }
    );
}

export function BrewPotion(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_potion_" + rowId + "_potion_";

    getAttrs(
        [
            prefix + "name",
            prefix + "essence",
            prefix + "effect",
            prefix + "batch",
            "alchemy",
            "essence_fire",
            "essence_earth",
            "essence_water",
            "essence_air",
            "elementalAttunement"
        ],
        function(values) {
            const name = values[prefix + "name"] || "";
            const natura = values[prefix + "essence"] || "";
            let effect = values[prefix + "effect"] || "";
            const alchemyRanks = parseInt(values["alchemy"]) || 0;
            const batchSize = parseInt(values[prefix + "batch"]) || 0;

            const batchCount = Math.ceil(batchSize / alchemyRanks);
            
            const fireEssence = parseInt(values["essence_fire"]) || 0;
            const waterEssence = parseInt(values["essence_water"]) || 0;
            const earthEssence = parseInt(values["essence_earth"]) || 0;
            const airEssence = parseInt(values["essence_air"]) || 0;
            const elementalAttunement = values["elementalAttunement"] || "";
            
            let naturaCosts = {
                air: 0,
                earth: 0,
                fire: 0,
                water: 0
            };

            // Parse Natura field
            if(natura != "") {
                naturaCosts = ParseNatura(natura, elementalAttunement, batchSize);
            }

            // Brew Potion
            if(fireEssence >= naturaCosts.fire
                && waterEssence >= naturaCosts.water
                && earthEssence >= naturaCosts.earth
                && airEssence >= naturaCosts.air)
            {
                let rollString = CUSTOM_TEMPLATE_BEGINNING;
                const complexity = (naturaCosts.fire + naturaCosts.water + naturaCosts.air + naturaCosts.earth) / batchSize;

                // Name & Potency
                const potency = complexity;
                if(batchSize > 1) {
                    rollString += `{{name=Brewing ${batchSize} ${name} Potions [P${potency}]}}`;
                }
                else {
                    rollString += `{{name=Brewing ${name} Potion [P${potency}]}}`;
                }

                // Duration (How long it takes to brew)
                const brewHours = Math.max(1, (complexity - alchemyRanks) * batchCount);
                rollString += `{{duration=${brewHours} hours}}`;

                // Effect
                if(effect != "") {
                    effect = effect.replaceAll("[P]", `[[${potency}[Potency]]]`);
                    rollString += `{{description=${effect}}}`;
                }

                startRoll(rollString, (r) => {
                    setAttrs({
                        essence_fire: fireEssence - naturaCosts.fire,
                        essence_water: waterEssence - naturaCosts.water,
                        essence_earth: earthEssence - naturaCosts.earth,
                        essence_air: airEssence - naturaCosts.air
                    });

                    finishRoll(r.rollId);
                });
            }
        }
    );
}