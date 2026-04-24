/**
 * @typedef {Object} Curse
 * @property {string} natura
 * @property {string} target
 * @property {string} sacrifice
 * @property {string} description
 * @property {string} breakingCondition
 */

/**
 * @type {Object.<string, Curse>}
 */
const CURSES = {
    "lycanthropy": {
        natura: "20 Fire",
        target: "1 Creature (Human)",
        sacrifice: "Fresh blood drawn directly from the target within the last hour that must be trifled over a silver blade.",
        description: "Also known as the werewolf curse. This curse turns a human into a werewolf. Every full moon at nightfall the target turns into a humanoid wolf creature (Use the Werewolf stat sheet). While in this form, it is driven by an insatiable hunger for meat, especially that of humans. At dawn, the target turns back into its human form and loses all memories of anything that happened while turned.",
        breakingCondition: "The curse can be broken by trifling fresh blood of the witch that inflicted the curse drawn within the last hour onto a silver blade and stabbing the target with it."
    },
    "bad luck": {
        natura: "5 Fire, 5 Air, 5 Earth, 5 Water",
        target: "1 Creature",
        sacrifice: "A symbol of luck such as a four leaf clover that must be burnt along with a strand of hair taken off of the target within the last hour.",
        description: "The target creature has disadvantage on all tests.",
        breakingCondition: "Once a day at the end of a Long Rest, the target can attempt to break the curse by performing a difficult task and rolling a 20 on at least one of the d20s on the associated test."
    },
    "eternal nightmares": {
        natura: "10 Air, 10 Water",
        target: "1 Creature",
        sacrifice: "A lock of the target's hair, burned with black wax and placed under their bed or pillow.",
        description: "The target creature is plagued by vivid, horrifying nightmares whenever they sleep. Long Rests only recover half of their health point maximum - [P] health points.",
        breakingCondition: "The target must defeat a creature spawned from their nightmares in the dream world. In order to do that, the target must be made aware of the situation in their dream by means of a Dreamwalk ritual."
    },
    "rusting decay": {
        natura: "10 Earth",
        target: "1 Object (weapon, or piece of armor)",
        sacrifice: "A piece of metal that has naturally rusted over 50 years or more, ground into powder and sprinkled over the object.",
        description: "The target object constantly corrodes.\nIf it is a piece of armor, its AV is cumulatively reduced by 1 every day at dawn. Once its AV hits 0, it crumbles to dust and is destroyed.\nIf it is a weapon, it gets a cumulative -1 penalty to all damage rolls daily at dawn. After 10 - [P] + [Q] days (where [Q] is the weapon’s quality or 0 if it has no associated quality) the weapon crumbles to dust and is destroyed.",
        breakingCondition: "None."
    },
    "forked tongue": {
        natura: "10 Air, 5 Water",
        target: "1 Creature",
        sacrifice: "The burned tongue of a songbird, which must be eaten by the target.",
        description: "The target creature cannot speak the truth. Every spoken statement is twisted into a lie, even if unintentional.",
        breakingCondition: "The target must witness the witch that inflicted the curse on it speaking 3 lies within one day."
    },
    "shattered fate": {
        natura: "5 Fire, 5 Air, 5 Earth, 5 Water",
        target: "1 Creature",
        sacrifice: "A mirror that the target has looked into within the last day, shattered and buried at a crossroads.",
        description: "Whenever the target rolls a natural 20 on a test, they must reroll and use the new result.",
        breakingCondition: "The target must voluntarily fail a task at great personal cost."
    },
    "gluttony": {
        natura: "10 Earth, 5 Water",
        target: "1 Creature",
        sacrifice: "A food item the target has taken a bite out of within the last 24 hours that must be fed to an animal with black fur or feathers at midnight.",
        description: "The target can never feel full. They must consume three times as much food daily to avoid exhaustion, but no amount of food can ever truly satisfy them.",
        breakingCondition: "The target must fast for seven full days (no food, only water), enduring the hardship without falling unconscious or dying. At the dawn of the 8th day the curse is broken."
    },
    "silence": {
        natura: "20 Air",
        target: "1 Creature",
        sacrifice: "The written notes of a melody that the target has hummed or whistled within the last hour, which you must eat.",
        description: "The target is rendered mute. They cannot speak or produce vocal sounds.",
        breakingCondition: "The target must witness the witch that inflicted the curse humming, whistling, or singing the melody that she ate."
    },
    "grasping roots": {
        natura: "17 Earth",
        target: "a [P] x 10m square area",
        sacrifice: "A branch of an ancient tree mixed with the blood of a medium or larger carnivore that must be implanted in the centre of the target area. Creatures smeared with some of the same blood when inflicting the curse can pass the area unaffected.",
        description: "The target area becomes overgrown with aggressive moving roots and vines.\nMovement through the cursed area is halved.\nAt the start of each creature’s turn in the area, they must succeed on an Athletics or Evasion test against 10 + [P] or be restrained until the start of their next turn.",
        breakingCondition: "Burn the branch of the ancient tree at the centre of the area."
    },
    "sanguine seal": {
        natura: "7 Fire, 10 Earth, 3 Water",
        target: "a room or building up to [P] x 10m in its largest dimension",
        sacrifice: "Blood of the person who most recently owned or controlled the structure, which must be smeared over one of the room’s or building’s entrances.",
        description: "All doors, windows, and other access points in the target area can only be opened by creatures marked with the blood used in the sacrifice.\nAll others find doors and windows impossibly sealed. They’re unable to open the doors and windows by any means short of magic.",
        breakingCondition: "The person whose blood was used for the sacrifice must personally ask someone who isn’t marked by the blood to enter the target area."
    }
};

export function UpdateCurse(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }
    
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_curse_" + rowId + "_";

    getAttrs([prefix+"curse_name", "spellwork"], function(values) {
        const curseName = values[prefix+"curse_name"] || "";
        const spellworkRanks = parseInt(values["spellwork"]) || 0;

        const listCurse = CURSES[curseName.toLowerCase()];
        if(listCurse !== undefined) {
            let attributes = {};

            attributes[prefix+"curse_natura"] = (listCurse.natura).replaceAll("[P]", spellworkRanks);
            attributes[prefix+"curse_target"] = (listCurse.target).replaceAll("[P]", spellworkRanks);
            attributes[prefix+"curse_sacrifice"] = (listCurse.sacrifice).replaceAll("[P]", spellworkRanks);
            attributes[prefix+"curse_description"] = (listCurse.description).replaceAll("[P]", spellworkRanks);
            attributes[prefix+"curse_breakingCondition"] = (listCurse.breakingCondition).replaceAll("[P]", spellworkRanks);

            setAttrs(attributes);
        }
    });
}

export function UpdateCursePowers() {
    getSectionIDs("curse", function(ids) {
        for(var i = 0; i < ids.length; i++) {
            const prefix = "repeating_curse_" + ids[i] + "_";

            getAttrs([prefix + "curse_name", "spellwork"], function(values) {
                const curseName = values[prefix+"curse_name"] || "";
                const spellworkRanks = parseInt(values["spellwork"]) || 0;
                
                const listCurse = CURSES[curseName.toLowerCase()];
                if(listCurse !== undefined) {
                    let attributes = {};

                    attributes[prefix+"curse_natura"] = (listCurse.natura).replaceAll("[P]", spellworkRanks);
                    attributes[prefix+"curse_target"] = (listCurse.target).replaceAll("[P]", spellworkRanks);
                    attributes[prefix+"curse_sacrifice"] = (listCurse.sacrifice).replaceAll("[P]", spellworkRanks);
                    attributes[prefix+"curse_description"] = (listCurse.description).replaceAll("[P]", spellworkRanks);
                    attributes[prefix+"curse_breakingCondition"] = (listCurse.breakingCondition).replaceAll("[P]", spellworkRanks);

                    setAttrs(attributes);
                }
            });
        }
    });
}