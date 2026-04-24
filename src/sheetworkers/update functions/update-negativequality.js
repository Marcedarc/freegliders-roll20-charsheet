/**
 * @type {Object.<string, string>}
 */
const NEGATIVE_QUALITY_DESCRIPTIONS = {
    "addict": "You can select this quality more than once, but have to select a different drug each time.\nAt Level 1, you have a -1 penalty to all Body tests. This penalty increases by -1 for each Level after 1.\nAt Level 2, you have disadvantage on Body tests if you haven’t had a dose of the chosen drug in the last 24 hours.\nAt Level 3, you have disadvantage on Body tests if you haven’t had a dose of the chosen drug in the last 2 hours.",
    "callous": "You gain a -2 penalty on Intuition tests made to judge the intentions or emotional state of another creature, for example when trying to tell if they’re telling the truth.\nThis quality is incompatible with Empathetic.",
    "clumsy": "You have a -2 penalty to Agility tests.\nThis quality is incompatible with Agile.",
    "disgraced": "You have disadvantage on Prayer and Mythology tests related to your own religion.",
    "dull": "You have a -2 penalty to Logic tests.\nThis quality is incompatible with Analytical Mind.",
    "essence vulnerability": "You have disadvantage on Willpower tests made to resist spells, rituals, or curses.",
    "farsighted": "At Level 1, you have a -1 penalty to all Perception tests relying on sight. This penalty increases by -1 for each Level after 1.\nAt Level 2, you apply the same penalty to attack tests against targets within 6m of you.\nAt Level 3, you have disadvantage on Perception tests relying on sight.\nWearing prescription lenses can offset the level of this quality, or suppress it altogether.\nThis quality is incompatible with Nearsighted.",
    "fragile": "Your maximum hit points decrease by your character level for each level of Fragile.\nThis quality is incompatible with Tough.",
    "hard of hearing": "At Level 1, you have a -1 penalty to all Perception tests relying on hearing. This penalty increases by -1 for each Level after 1.\nAt Level 2, you apply the same penalty to Initiative and Evasion tests.\nAt Level 3, you have disadvantage on Perception tests relying on hearing.\nUsing hearing aids can offset the level of this quality, or suppress it altogether.",
    "nearsighted": "At Level 1, you have a -1 penalty to all Perception tests relying on sight. This penalty increases by -1 for each Level after 1.\nAt Level 2, you apply the same penalty to attack tests against targets that are 6m or more away from you.\nAt Level 3, you have disadvantage on Perception tests relying on sight.\nWearing prescription lenses can offset the level of this quality, or suppress it altogether.\nThis quality is incompatible with Farsighted.",
    "slow": "Your movement speed decreases by 2m for each level of Slow.\nThis quality is incompatible with Fast.",
    "weak": "You have a -2 penalty to Athletics tests and your carry capacity is halved.\nThis quality is incompatible with Strong.",
    "phobia": "You are irrationally afraid of something which will be referred to as the target of your phobia. You can have multiple instances of this quality, choosing a different target for each instance.\nWhile you’re exposed to the target of your phobia, you have disadvantage on all tests. Being exposed means you’re perceiving the target in whatever way.\nThe level of this quality is tied to how common the target of your phobia is. Keep in mind that different environments might make it more or less likely to encounter certain things and that should be factored in here. Talk to your GM to determine the level of your phobia.\nLevel 1 means your target is quite rare or specific and it’s rather unlikely to encounter it. For example, you might be afraid of unicorns or ghosts.\nLevel 2 means you are likely to encounter your target, though not on a regular basis. For example, you might be afraid of power cores or wolves.\nLevel 3 means you are very likely to encounter your target on a regular basis if you don’t actively avoid it. For example, you might be afraid of spiders or firearms.",
    "socially inept": "You have a -2 penalty to Charisma tests.\nThis quality is incompatible with Silver Tongue."
};

function AddNegativeQuality(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_negativeQuality_" + rowId + "_";

    const newQuality = eventInfo.newValue;
    const description = NEGATIVE_QUALITY_DESCRIPTIONS[newQuality.toLowerCase()];

    if(description !== undefined) {
        let attributes = {};
        attributes[prefix + "negativeQuality_description"] = description;
        setAttrs(attributes);
    }

    switch(newQuality.toLowerCase()) {
        case "addict":
            UpdateNegativeQualityLevel(eventInfo);
            break;
        case "clumsy":
            setAttrs({
                clumsyPenalty: -2
            });
            break;
        case "dull":
            setAttrs({
                dullPenalty: -2
            });
            break;
        case "fragile":
            UpdateNegativeQualityLevel(eventInfo);
            break;
        case "weak":
            setAttrs({
                weakPenalty: -2
            });
            break;
        case "socially inept":
            setAttrs({
                sociallyIneptPenalty: -2
            });
            break;
    }
}

export function RemoveNegativeQuality(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_negativequality_" + rowId + "_";

    let oldQuality = eventInfo.previousValue;
    if(eventInfo.triggerName.startsWith("remove:")) {
        oldQuality = eventInfo.removedInfo[prefix + "negativeQuality_name"];
    }

    if(oldQuality === undefined) {
        return;
    }

    switch(oldQuality.toLowerCase()) {
        case "addict":
            setAttrs({
                addictPenalty: 0
            });
            break;
        case "clumsy":
            setAttrs({
                clumsyPenalty: 0
            });
            break;
        case "dull":
            setAttrs({
                dullPenalty: 0
            });
            break;
        case "fragile":
            setAttrs({
                fragilePenalty: 0
            });
            break;
        case "weak":
            setAttrs({
                weakPenalty: 0
            });
            break;
        case "socially inept":
            setAttrs({
                sociallyIneptPenalty: 0
            });
            break;
    }
}

export function UpdateNegativeQualityLevel(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_negativequality_" + rowId + "_";
    
    getAttrs([prefix + "negativeQuality_name", prefix + "negativeQuality_level"], function(values) {
        const quality = values[prefix + "negativeQuality_name"] || "";
        const level = parseInt(values[prefix + "negativeQuality_level"]) || 0;

        switch(quality.toLowerCase()) {
            case "addict":
                setAttrs({
                    addictPenalty: level * -1
                });
                break;
            case "fragile":
                setAttrs({
                    fragilePenalty: level * -1
                });
                break;
        }
    });
}

export function UpdateNegativeQuality(eventInfo) {
    const oldQuality = eventInfo.previousValue;

    if(oldQuality !== undefined) {
        RemoveNegativeQuality(eventInfo);
    }

    const newQuality = eventInfo.newValue;
    
    if(newQuality !== undefined) {
        AddNegativeQuality(eventInfo);
    }
}