import { HasEnoughEssence, ParseNatura } from "../../helpers";
import { CUSTOM_TEMPLATE_BEGINNING } from "../../worker-constants";

/**
 * @typedef {Object} Ritual
 * @property {string} essence
 * @property {string} description
 */

/**
 * @type {Object.<string, Ritual>}
 */
const RITUALS = {
    "scrying": {
        essence: "5 Air, 5 Water, 5 Earth",
        description: "As part of this ritual you infuse a reflective surface like a puddle of water, a mirror, or a shiny piece of metal that must not move while the ritual is being performed.\nChoose a target creature, object, or place. Make a Spellwork [WIL] test with a difficulty of 10 that is modified based on how familiar you are with the target and what sort of physical connection you have to it. If the target is a creature, the base difficulty is equal to that creature’s Willpower test instead of 10. If you succeed on your test, the ritual takes effect, otherwise it fails.\nFor the next [P] × 10 minutes the target and its surroundings are visible and audible through the infused surface as if it was following it around. If the target is a creature, it feels observed."
    },
    "nightvision": {
        essence: "3 Fire, 3 Air",
        description: "As part of this ritual you infuse up to [P] willing creatures that must not move while the ritual is being performed.\nThe target creatures gain Nightvision for the next 12 hours."
    },
    "water breathing": {
        essence: "3 Air, 3 Water",
        description: "As part of this ritual you infuse up to [P] willing creatures that must not move while the ritual is being performed.\nThe target creatures gain the ability to breathe underwater for the next 12 hours."
    },
    "warming": {
        essence: "3 Fire",
        description: "As part of this ritual you infuse a willing creature that must not move while the ritual is being performed.\nThe target creature is unaffected by extreme cold temperatures for the next [P] days. No damage resistance is gained in this way."
    },
    "cooling": {
        essence: "2 Air, 1 Water",
        description: "As part of this ritual you infuse a willing creature that must not move while the ritual is being performed.\nThe target creature is unaffected by extreme heat for the next [P] days. No damage resistance is gained in this way."
    },
    "beauty": {
        essence: "2 Fire, 2 Air, 2 Earth, 2 Water",
        description: "As part of this ritual you infuse a willing humanoid creature that must not move while the ritual is being performed.\nThe target becomes a more beautiful version of itself and gains a +[P] bonus to Social tests for the next 24 hours, after which it is returned to its former appearance."
    },
    "disguise": {
        essence: "4 Air, 4 Earth",
        description: "As part of this ritual you infuse a willing human that must not move while the ritual is being performed.\nThe target turns into a different person with an appearance and voice of your choice. It can be any person you have seen before or a new person with an entirely made up appearance and voice, as long as the desired outcome is no more than 50 cm taller or smaller than the target. The target remains in this form for [P] hours, after which it reverts back."
    },
    "locate": {
        essence: "3 Air, 3 Water, 3 Earth",
        description: "As part of this ritual you infuse a map, compass, divining rod or something similar that must not move while the ritual is being performed.\nChoose a target creature, object, or place. Make a Spellwork [WIL] test with a difficulty of 10 that is modified based on how familiar you are with the target and what sort of physical connection you have to it. If the target is a creature, the base difficulty is equal to that creature’s Willpower test instead of 10. If you succeed on your test, the ritual takes effect, otherwise it fails.\nFor the next [P] × 10 minutes the infused object shows the location of the target. For example, a dot on an infused map, or the compass pointing towards the target instead of north."
    },
    "astral projection": {
        essence: "10 Air, 5 Water",
        description: "You project your consciousness to a place of your choice within [P] km that you can see or describe (for example 200m north, or behind the door). You appear at the target location as an incorporeal spectral ghost that looks like yourself. While in this form, you can float in all directions at a speed of 20m and can move through objects and creatures. You can not interact with the world around you in any physical way but you can talk as normal. While in this form, your physical body remains in a deep meditative unconscious state and you are unable to perceive what it perceives until you end the ritual at any point as a Minor Action. If your physical body takes any damage, the ritual ends immediately."
    },
    "dreamwalk": {
        essence: "8 Air, 3 Water",
        description: "You project your consciousness and that of up to [P] other creatures into the dream of a target sleeping creature within [P] km. If the target creature is not unconscious, the ritual fails. You and the other dreamwalkers can choose to appear as silent, invisible observers or as participants within the dream and at any point while the ritual is ongoing, you and the other dreamwalkers can switch into different participants or back to silent observers. As participants, you can interact with the dream and the dreamer. As silent observers you can not interact with the dream or the dreamer, but observe everything.\nWhen a dreamwalker takes the form of a participant, they make a Deception vs Intuition contest against the dreamer. If the dreamer wins, they notice that something is off and may choose to expel that participant from their dream, ending the ritual for the affected dreamwalker."
    },
    "identify": {
        essence: "5 Air, 10 Water",
        description: "As part of the ritual you examine an object that must not move while the ritual is being performed.\nYou learn what the object is called, what it is used for, who created it (if it was crafted in any way), where it is from (if it was not crafted but harvested from somewhere like a piece of rock, a plant or a part of a creature), what it is worth in its current state, how much Essence can be extracted from it, and what Infusions or Rituals (if any) are affecting it."
    },
    "divination warding": {
        essence: "6 Air, 6 Water",
        description: "As part of the ritual you infuse an object, creature or place (a vehicle, room, or building) no larger than [P]m in any direction that must not move while the ritual is being performed.\nFor the next [P] hours, the target is warded against scrying and magical location, causing any such rituals or other magical effects to fail on them.\nIf this ritual is successfully performed on the same object or place for 10 consecutive times without a break for 10 days in a row, the effect becomes permanent on the target.\nIf the target is already affected by this ritual, it keeps the higher powered version."
    },
    "spirit warding": {
        essence: "4 Air, 6 Water, 2 Earth",
        description: "As part of the ritual you infuse a place (a vehicle, room, or building) no larger than [P]m in any direction that must not move while the ritual is being performed.\nFor the next [P] hours, the target is warded against spirits and creatures without a physical form (like ghosts, or astral projections), making it unable for them to enter the area in any way. Any such creature already in the area is expelled to the nearest unoccupied space outside of the target area.\nIf this ritual is successfully performed on the same place for 10 consecutive times without a break for 10 days in a row, the effect becomes permanent.\nIf the target is already affected by this ritual, it keeps the higher powered version."
    },
    "monster warding": {
        essence: "4 Fire, 4 Air, 4 Water, 4 Earth",
        description: "As part of the ritual you infuse a creature or place (a vehicle, room, or building) no larger than [P]m in any direction that must not move while the ritual is being performed.\nIf the target is a place:\nFor the next [P] hours, the target is warded against monsters, making it unable for them to enter the area in any way. Any such creature already in the area is expelled to the nearest unoccupied space outside of the target area.\nIf this ritual is successfully performed on the same place for 10 consecutive times without a break for 10 days in a row, the effect becomes permanent.\nIf the target is a creature:\nFor the next [P] hours, the target is warded against monsters, making it unable for them to possess or charm them. Ongoing possessions or charms by monsters are suspended for the duration of the warding. Also, all monsters have disadvantage on attacks against the target.\nIf the target is already affected by this ritual, it keeps the higher powered version."
    },
    "death warding": {
        essence: "5 Fire, 5 Air, 5 Water, 5 Earth",
        description: "As part of the ritual you infuse a creature that must not move while the ritual is being performed.\nFor the next [P] hours, the target is warded against death. The next time the target creature would die within that time, they are reduced to 1 hit point instead, ending the ritual.\nIf the target is already affected by this ritual, it keeps the higher powered version."
    },
    "[damage type] warding": {
        essence: "3 Fire, 3 Air, 3 Water, 3 Earth",
        description: "As part of the ritual you infuse a creature or object no larger than [P]m in any direction that must not move while the ritual is being performed.\nFor the next [P] hours, the target becomes resistant against one damage type of your choice.\nIf the target is already affected by this ritual with the same damage type selected, it keeps the higher powered version. If the target is affected by another version of this ritual with a different damage type selected, both versions of the ritual remain in effect."
    },
    "open portal": {
        essence: "20 Air",
        description: "As part of the ritual you infuse a surface.\nChoose a target location within [P] x 10km that you have either been to before, can see, or that you have an associated object of. An associated object can be anything that has either spent at least a year at the target location or has been there in the last 24 hours.\nAt the end of the ritual, a portal in the shape of your choice, but no larger than [P]m in any dimension opens on the surface you infused. At the same time a connected portal opens in the target location aligned just like the surface you infused. Both portals can only be walked through on one side and the other side is opaque and solid.\nThe portals remain open until [P] minutes have passed, upon which they collapse instantly, cutting any objects or creatures within clean through."
    },
    "blade bond": {
        essence: "10 Air, 5 Earth",
        description: "Even though the name suggests otherwise, this ritual works on any target object up to [P] Slots in size and weight. This ritual binds the target to you magically.\nAs a Minor Action, you can summon an object bound to you by this ritual, making it appear in your empty hand(s), on your body (if it’s a piece of clothing or armor) or in an empty space directly in front of you.\nThe ritual is most commonly used on daggers and swords, which is where the name comes from, but can be and is used on all kinds of objects.\nAn object can only be bound to one creature by this ritual. Performing this ritual again on an object already bound by it to a creature will remove the previous bond."
    },
    "bought time": {
        essence: "20 Air, 20 Earth, 20 Fire, 20 Water",
        description: "At the end of this ritual, make a Spellwork [WIL] or Spellwork [BOD] test against 20 + [P].\nOn a success, the ritual succeeds and your life expectancy increases by [P] years. You can choose to also reduce your apparent age, meaning your physical appearance, by up to that same amount.\nOn a failure, the ritual’s effect is reversed and you immediately grow [P] years older."
    }
};

export function UpdateRitual(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }

    const rowId = eventInfo.sourceAttribute.split("_")[2];

    DoUpdateRitual(rowId);
}

export function UpdateRituals() {
    getSectionIDs("ritual", function(ids) {
        for(var i = 0; i < ids.length; i++) {
            DoUpdateRitual(ids[i]);
        }
    });
}

function DoUpdateRitual(rowId) {
    const prefix = "repeating_ritual_" + rowId + "_ritual_";

    getAttrs([prefix+"name", "essence_air", "essence_earth", "essence_fire", "essence_water", "elementalAttunement", prefix + "essence"], function(values) {
        const ritualName = values[prefix+"name"] || "";
        const airEssence = parseInt(values["essence_air"]) || 0;
        const earthEssence = parseInt(values["essence_earth"]) || 0;
        const fireEssence = parseInt(values["essence_fire"]) || 0;
        const waterEssence = parseInt(values["essence_water"]) || 0;
        const elementalAttunement = values["elementalAttunement"] || "";
        let naturaString = values[prefix + "essence"] || "";
        
        let attributes = {};

        const listRitual = RITUALS[ritualName.toLowerCase()];
        if(listRitual !== undefined) {
            attributes[prefix+"essence"] = listRitual.essence;
            attributes[prefix+"description"] = listRitual.description;

            naturaString = listRitual.essence;
            
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
    });
}

export function PerformRitual(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_ritual_" + rowId + "_ritual_";

    getAttrs(
        [
            prefix + "name",
            prefix + "essence",
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
            const natura = values[prefix + "essence"] || "";
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

            // Perform Ritual
            if(fireEssence >= naturaCosts.fire
                && waterEssence >= naturaCosts.water
                && earthEssence >= naturaCosts.earth
                && airEssence >= naturaCosts.air)
            {
                let rollString = CUSTOM_TEMPLATE_BEGINNING;

                // Name & Power
                const power = runecraftRanks;
                rollString += `{{name=${name} [P${power}]}}`;
                
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