import { CUSTOM_TEMPLATE_BEGINNING } from "../../worker-constants";

/**
 * @typedef {Object} Blessing
 * @property {string} action
 * @property {string} components
 * @property {number} faith
 * @property {string} range
 * @property {string} description
 * @property {string | undefined} duration
 * @property {string | undefined} area
 */

/**
 * @type {Object.<string, Blessing>}
 */
const BLESSINGS = {
    "blessing of regeneration": {
        action: "Major Action",
        components: "Motus, Vox",
        faith: 5,
        range: "10m",
        duration: "1 minute",
        description: "The target creature restores [P] hit points at the start of each of its turns for the duration."
    },
    "blessing of protection": {
        action: "Major Action",
        components: "Motus, Vox",
        faith: 3,
        range: "20m",
        duration: "10 minutes",
        description: "The target creature or object gains a +[P] bonus to all of its Armor Values for the duration."
    },
    "blessing of haste": {
        action: "Major Action",
        components: "Motus, Vox",
        faith: 10,
        range: "10m",
        duration: "1 minute",
        description: "The target creature’s movement speed increases by +[P] × 2 m and it gains an additional Minor Action for the duration."
    },
    "blessing of attention": {
        action: "Major Action",
        components: "Vox",
        faith: 3,
        range: "20m",
        duration: "1 minute",
        description: "The target creature gains a +[P] bonus to all Evasion tests for the duration."
    },
    "blessing of burden": {
        action: "Major Action",
        components: "Vox",
        faith: 2,
        range: "Touch",
        duration: "[P] hours",
        description: "The target creature’s carry capacity is doubled for the duration."
    },
    "blessing of warding off evil": {
        action: "Major Action",
        components: "Motus, Vox",
        faith: 20,
        range: "Touch",
        area: "10m Dome",
        duration: "[P] hours",
        description: "You create a warded space around a target point on a surface you touch. For the duration, no unholy creature can enter the area or target another creature inside the area with an attack, spell, or other magical effect. Areas of Effect created from an unholy creature can not extend inside of the blessed area."
    },
    "blessing of sanctity": {
        action: "Major Action",
        components: "Motus, Vox",
        faith: 15,
        range: "Touch",
        duration: "[P] minutes",
        description: "For the duration, the target creature’s unholy trait is suppressed."
    },
    "blessing of purification": {
        action: "Minor Action",
        components: "Motus",
        faith: 4,
        range: "10m",
        description: "If the target is a creature, you remove [P] stacks of the poisoned condition from it.\nIf the target is a food or drink, you make it safe to consume, neutralising any poisons in it and removing any harmful impurities."
    },
    "blessing of health": {
        action: "Major Action",
        components: "Motus, Vox",
        faith: 7,
        range: "Touch",
        description: "You cure the target of a disease."
    },
    "blessing of wound closure": {
        action: "Minor Action",
        components: "Vox",
        faith: 5,
        range: "Touch",
        description: "The target creature loses [P] stacks of bleeding."
    },
    "blessing of guidance": {
        action: "Major Action",
        components: "Motus, Vox",
        faith: 10,
        range: "10m",
        duration: "1 minute",
        description: "For the duration, the target creature gains a +[P] bonus to all tests made with one attribute that you choose when bestowing this blessing."
    },
    "blessing of smiting": {
        action: "Minor Action",
        components: "Motus",
        faith: 3,
        range: "Touch",
        description: "The target of this blessing can be either a weapon, or up to 20 pieces of ammunition. The next time the target deals damage to an unholy creature, it deals an extra +[P] fire damage to it that ignores resistances, vulnerabilities and armor."
    },
    "blessing of comprehension": {
        action: "Major Action",
        components: "Vox",
        faith: 6,
        range: "20m",
        duration: "1 hour",
        description: "Up to [P] target creatures within range understand all spoken and written languages for the duration. The blessing fails for targets that don’t understand any languages before the blessing is bestowed."
    },
    "blessing of comfort": {
        action: "Major Action",
        components: "Motus, Vox",
        faith: 5,
        range: "10m",
        duration: "[P] hours",
        description: "For the duration, the target creature is unaffected by extreme temperatures, like the heat of a desert or the cold of a glacier."
    }
};

function DoUpdateBlessing(rowId) {
    const prefix = "repeating_blessing_" + rowId + "_blessing_";

    getAttrs([prefix + "name", "faith", prefix + "faith"], function(values) {
        const blessingName = values[prefix + "name"] || "";
        const faith = parseInt(values["faith"]) || 0;
        let faithCost = parseInt(values[prefix + "faith"]) || 0;

        let attributes = {};

        const listBlessing = BLESSINGS[blessingName.toLowerCase()];
        if(listBlessing !== undefined) {
            attributes[prefix + "action"] = listBlessing.action;
            attributes[prefix + "components"] = listBlessing.components;
            attributes[prefix + "faith"] = listBlessing.faith;
            attributes[prefix + "range"] = listBlessing.range;
            attributes[prefix + "area"] = listBlessing.area || "";
            attributes[prefix + "duration"] = listBlessing.duration || "";
            attributes[prefix + "description"] = listBlessing.description;
            attributes[prefix + "isListItem"] = "on";

            faithCost = listBlessing.faith;
        }
        else {
            attributes[prefix + "isListItem"] = "off";
        }
        
        // Check if enough Faith available
        if(faithCost > faith) {
            attributes[prefix + "error"] = "Not enough Faith!";
        }
        else {
            attributes[prefix + "error"] = " ";
        }

        setAttrs(attributes);
    });
}

export function UpdateBlessing(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }

    const rowId = eventInfo.sourceAttribute.split("_")[2];

    DoUpdateBlessing(rowId);
}

export function UpdateBlessings() {
    getSectionIDs("blessing", function(ids) {
        for(var i = 0; i < ids.length; i++) {
            DoUpdateBlessing(ids[i]);
        }
    });
}

export function UpdateMaxMemorisedBlessings() {
    getAttrs(["prayer", "log"], function(values) {
        const prayer = parseInt(values.prayer)||0;
        const log = parseInt(values.log)||0;

        setAttrs({
            "memorisedBlessings_max": Math.max(1, log + prayer)
        });
    });
}

export function UpdateMemorisedBlessings() {
    getSectionIDs("blessing", function(ids) {
        let memorised = 0;
        setAttrs({
            memorisedBlessings: memorised
        });

        for(var i = 0; i < ids.length; i++) {
            const prefix = "repeating_blessing_" + ids[i] + "_blessing_";

            getAttrs([prefix + "memorised"], function(values) {
                if(values[prefix + "memorised"] == 'on') {
                    memorised++;

                    setAttrs({
                        memorisedBlessings: memorised
                    });
                }
            });
        }
    });
}

export function InvokeBlessing(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_blessing_" + rowId + "_blessing_";

    getAttrs(
        [
            prefix + "name",
            prefix + "action",
            prefix + "components",
            prefix + "faith",
            prefix + "range",
            prefix + "area",
            prefix + "duration",
            prefix + "description",
            "faith",
            "prayer"
        ],
        function(values) {
            const name = values[prefix + "name"] || "";
            const action = values[prefix + "action"] || "";
            const components = values[prefix + "components"] || "";
            const blessingFaith = parseInt(values[prefix + "faith"]) || 0;
            let range = values[prefix + "range"] || "";
            let area = values[prefix + "area"] || "";
            let duration = values[prefix + "duration"] || "";
            let description = values[prefix + "description"] || "";
            const faithPool = parseInt(values["faith"]) || 0;
            const prayerRanks = parseInt(values["prayer"]) || 0;

            if(faithPool >= blessingFaith) {
                // Invoke Blessing
                let rollString = CUSTOM_TEMPLATE_BEGINNING;

                // Name
                rollString += `{{name=${name}}}`;
                // Action
                rollString += `{{action=${action}}}`;
                // Components
                rollString += `{{components=${components}}}`;
                // Power
                let powerString = `[[${prayerRanks}[Prayer Ranks]`;
                rollString += `{{power=[[${prayerRanks}[Prayer Ranks]`;
                // Additional Faith for extra Power
                if(faithPool > blessingFaith) {
                    rollString += `?{Spend more Faith?|+0 Faith, `;
                    for(let i = 1; i <= prayerRanks && (i + blessingFaith) <= faithPool; i++) {
                        rollString += `|+${i} Faith,+${i}[+${i} Faith]`;
                    }
                    rollString += `}`;
                    powerString += "?{Spend more Faith?}";
                }
                rollString += `]]}}`;
                powerString += "]]";
                // Range
                if(range != "") {
                    range = range.replaceAll("[P]", powerString);
                    rollString += `{{range=${range}}}`;
                }
                // Area
                if(area != "") {
                    area = area.replaceAll("[P]", powerString);
                    rollString += `{{area=${area}}}`;
                }
                // Duration
                if(duration != "") {
                    duration = duration.replaceAll("[P]", powerString);
                    rollString += `{{duration=${duration}}}`;
                }
                // Description
                if(description != "") {
                    description = description.replaceAll("[P]", powerString);
                    rollString += `{{description=${description}}}`;
                }
                
                startRoll(rollString, (r) => {
                    const blessingPower = r.results["power"].result;
                    const expendedFaith = blessingFaith + (blessingPower - prayerRanks);

                    setAttrs({
                        faith: faithPool - expendedFaith
                    });

                    finishRoll(r.rollId);
                });
            }
            else {
                console.error(`Can't invoke ${name}! Not enough Faith available.`);
            }
        }
    );
}