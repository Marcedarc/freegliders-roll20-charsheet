import { HasEnoughEssence, ParseNatura } from "../../helpers";
import { CUSTOM_TEMPLATE_BEGINNING } from "../../worker-constants";

/**
 * @typedef {Object} Rune
 * @property {string} target
 * @property {string} natura
 * @property {string} description
 */

/**
 * @type {Object.<string, Rune>}
 */
const RUNES = {
    "calidum": {
        target: "Object or Creature",
        natura: "1 Fire",
        description: "Target gets warmed up to nice and cozy temperatures in cold environments. A creature affected by the Calidum rune or wearing a piece of clothing with the Calidum rune suffers no ill effects from non-magical cold weather and gains a +[P] bonus on tests made to resist the frozen condition."
    },
    "frigus": {
        target: "Object or Creature",
        natura: "1 Water",
        description: "Target gets chilled down to nice and cozy temperatures in hot environments. A creature affected by the Frigus rune or wearing a piece of clothing with the Frigus rune suffers no ill effects from non-magical hot weather and gains a +[P] bonus on tests made to resist the burning condition."
    },
    "reparo": {
        target: "Object",
        natura: "2 Earth",
        description: "Target object regains [P] health points every hour, as any damage done to it is slowly mended. This does not restore any magical properties."
    },
    "sano": {
        target: "Creature",
        natura: "2 Earth",
        description: "Target creature regains [P] health points at the end of every rest."
    },
    "conservo": {
        target: "Object (Container)",
        natura: "1 Earth, 1 Water",
        description: "Perishable objects, like food for example, that are stored inside the target container stay fresh for an additional [P] days."
    },
    "respiratio": {
        target: "Creature",
        natura: "2 Air",
        description: "Target creature can hold its breath for an additional [P] minutes."
    },
    "purgo": {
        target: "Object (Container)",
        natura: "1 Water, 2 Fire",
        description: "Water and other drinks inside the target container are purified of all non-magical poisons and become safe to drink. Potions and Elixirs with a Potency below [P] are purified as well, turning them into water."
    },
    "levis": {
        target: "Object or Creature",
        natura: "1 Air, 1 Earth",
        description: "Target object or creature has its weight reduced by [P]kg to a minimum of 1kg."
    },
    "gravis": {
        target: "Object or Creature",
        natura: "2 Earth",
        description: "Target object or creature has its weight increased by [P]kg."
    },
    "sera": {
        target: "Object (Container)",
        natura: "2 Earth",
        description: "Target container becomes locked magically. The lock can be unlocked temporarily using a passphrase determined when carving the rune and locked again by the same phrase or a different one also determined when carving the rune. A Sera rune can’t be picked but it can be forced open with brute force as if it was a lock with rating [P]."
    },
    "mundo": {
        target: "Object",
        natura: "2 Water",
        description: "Target object is cleaned and can’t get soiled in any non-magical way."
    },
    "protego": {
        target: "Object (Clothing, Armor, or Shield)",
        natura: "2 Earth",
        description: "Target piece of clothing or armor, or shield gets a +1 bonus to its Armor Value. This bonus can not increase the target’s Armor Value above [P]."
    },
    "silentium": {
        target: "Surface (Door, Window, Wall, Floor, or Ceiling inside a closed room)",
        natura: "3 Air",
        description: "Target room’s walls, doors, windows, floors, and ceilings become soundproof while all doors and windows are closed. Sounds that aren’t particularly loud, like explosions or yelling can neither enter nor escape the room while it is closed. The rune can only affect a room that is no larger than [P]m in any dimension, but can be stacked with other Silentium runes to increase that limit additively."
    },
    "damnum (air)": {
        target: "Up to 10 pieces of Ammunition or 1 Weapon",
        natura: "1 Air",
        description: "Target pieces of ammunition or weapon are enchanted to inflict additional effects based on the Element of Natura used when carving the rune.\nAir: On hit, the target is pushed back 2m."
    },
    "damnum (earth)": {
        target: "Up to 10 pieces of Ammunition or 1 Weapon",
        natura: "1 Earth",
        description: "Target pieces of ammunition or weapon are enchanted to inflict additional effects based on the Element of Natura used when carving the rune.\nEarth: On hit, the target takes +[P] blunt damage."
    },
    "damnum (fire)": {
        target: "Up to 10 pieces of Ammunition or 1 Weapon",
        natura: "1 Fire",
        description: "Target pieces of ammunition or weapon are enchanted to inflict additional effects based on the Element of Natura used when carving the rune.\nFire: On hit, they deal +[P] fire damage."
    },
    "damnum (water)": {
        target: "Up to 10 pieces of Ammunition or 1 Weapon",
        natura: "1 Water",
        description: "Target pieces of ammunition or weapon are enchanted to inflict additional effects based on the Element of Natura used when carving the rune.\nWater: On hit, the target takes +[P] cold damage."
    },
    "clypeus cordis": {
        target: "Object (Armor or Shield)",
        natura: "2 Earth",
        description: "Generates a shimmering protective barrier around the wearer of the target armor or shield. The barrier has a pool of [P] health points. When the target object or its wearer takes damage, the barrier takes damage first with no vulnerabilities or resistances and any leftover damage carries over."
    },
    "radians": {
        target: "Object",
        natura: "1 Fire",
        description: "The rune emits a warm glow, emitting dim light in a [P] x 2m radius."
    },
    "supprimo": {
        target: "Object or Creature",
        natura: "2 Air, 2 Earth, 2 Fire, 2 Water",
        description: "Every curse with a Power of [P] or lower that is affecting the target is suppressed for the target as long as this rune is active. The rune fades after [P] hours, upon which any suppressed curses continue."
    },
    "visio obscura": {
        target: "Creature",
        natura: "1 Air, 1 Fire",
        description: "The target gains Night Vision out to [P] x 2m."
    },
    "vita surripuit": {
        target: "Object (Melee Weapon)",
        natura: "1 Earth, 1 Fire, 3 Water",
        description: "The target melee weapon is enhanced to steal health from enemies. Once per turn, when the weapon hits a creature, the wielder of the weapon heals for the damage dealt after armor, vulnerabilities and resistances (to a maximum of [P] hit points)."
    },
    "auge salus": {
        target: "Creature",
        natura: "2 Earth, 3 Water",
        description: "Target creature’s maximum hit points are increased by +[P]."
    }
};

export function UpdateRune(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }

    const rowId = eventInfo.sourceAttribute.split("_")[2];

    DoUpdateRune(rowId);
}

export function UpdateRunes() {
    getSectionIDs("rune", function(ids) {
        for(var i = 0; i < ids.length; i++) {
            DoUpdateRune(ids[i]);
        }
    });
}

function DoUpdateRune(rowId) {
    const prefix = "repeating_rune_" + rowId + "_rune_";

    getAttrs(
        [
            prefix + "name",
            prefix + "natura",
            "elementalAttunement",
            "essence_air",
            "essence_earth",
            "essence_fire",
            "essence_water"
        ],
        function(values) {
            const runeName = values[prefix+"name"] || "";
            const airEssence = parseInt(values["essence_air"]) || 0;
            const earthEssence = parseInt(values["essence_earth"]) || 0;
            const fireEssence = parseInt(values["essence_fire"]) || 0;
            const waterEssence = parseInt(values["essence_water"]) || 0;
            const elementalAttunement = values["elementalAttunement"] || "";
            let naturaString = values[prefix + "natura"] || "";
            
            let attributes = {};

            const listRune = RUNES[runeName.toLowerCase()];
            if(listRune !== undefined) {
                attributes[prefix + "target"] = listRune.target;
                attributes[prefix + "natura"] = listRune.natura;
                attributes[prefix + "description"] = listRune.description;
                attributes[prefix + "isListItem"] = "on";

                naturaString = listRune.natura;
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

export function CarveRune(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_rune_" + rowId + "_rune_";

    getAttrs(
        [
            prefix + "name",
            prefix + "natura",
            prefix + "target",
            prefix + "description",
            "runecraft",
            "essence_fire",
            "essence_earth",
            "essence_water",
            "essence_air",
            "elementalAttunement"
        ],
        function(values) {
            const name = values[prefix + "name"] || "";
            const natura = values[prefix + "natura"] || "";
            let target = values[prefix + "target"] || "";
            let description = values[prefix + "description"] || "";
            const runecraftRanks = parseInt(values["runecraft"]) || 0;
            
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
                naturaCosts = ParseNatura(natura, elementalAttunement);
            }

            // Carve Rune
            if(fireEssence >= naturaCosts.fire
                && waterEssence >= naturaCosts.water
                && earthEssence >= naturaCosts.earth
                && airEssence >= naturaCosts.air)
            {
                let rollString = CUSTOM_TEMPLATE_BEGINNING;

                // Name & Power
                const power = runecraftRanks;
                rollString += `{{name=${name} Rune [P${power}]}}`;

                // Target
                if(target != "") {
                    target = target.replaceAll("[P]", `[[${power}[Power]]]`);
                    rollString += `{{target=${target}}}`;
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

                    finishRoll(r.rollId);
                });
            }
        }
    );
}