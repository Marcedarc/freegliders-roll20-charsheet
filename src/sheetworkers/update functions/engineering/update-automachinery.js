const PLATINGS = {
    "none": {
        dav: 0,
        evasionMod: 2,
        speedMod: 4
    },
    "aluminium": {
        dav: 1,
        evasionMod: 1,
        speedMod: 2
    },
    "copper": {
        dav: 2,
        evasionMod: 0,
        speedMod: 0
    },
    "steel": {
        dav: 4,
        evasionMod: -2,
        speedMod: -2
    },
    "ceramic": {
        dav: 6,
        evasionMod: -4,
        speedMod: -4
    },
    "titanium": {
        dav: 8,
        evasionMod: -6,
        speedMod: -6
    }
};

const AUTOMATON_CHASSIS_SIZES = {
    "small": {
        maxHp: 25,
        coreRating: 2,
        maxModules: 0,
        carryCapacity: 25,
        hpCapQualityMultiplier: 1
    },
    "medium": {
        maxHp: 50,
        coreRating: 4,
        maxModules: 5,
        carryCapacity: 50,
        hpCapQualityMultiplier: 2
    },
    "large": {
        maxHp: 100,
        coreRating: 6,
        maxModules: 10,
        carryCapacity: 100,
        hpCapQualityMultiplier: 5
    }
}

export function UpdateAutomatonPlating(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }
    
    let rowId = eventInfo.sourceAttribute.split("_")[2];
    let prefix = "repeating_automaton_" + rowId + "_";

    getAttrs([prefix + "automaton_plating"], function(values) {
        let plating = values[prefix + "automaton_plating"].toLowerCase();
        let attributes = {};

        if(plating in PLATINGS) {
            attributes[prefix + "automaton_dav"] = PLATINGS[plating].dav;
            setAttrs(attributes);
        }
    });
}

export function UpdateAutomatonStats(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }
    
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_automaton_" + rowId + "_";

    getAttrs([prefix + "automaton_chassis", prefix + "automaton_quality"], function(values) {
        const chassis = values[prefix + "automaton_chassis"].toLowerCase();
        let attributes = {};

        if(chassis in AUTOMATON_CHASSIS_SIZES) {
            const quality = parseInt(values[prefix + "automaton_quality"]) || 0;
            const qualityModifier = quality * AUTOMATON_CHASSIS_SIZES[chassis].hpCapQualityMultiplier;

            attributes[prefix + "automaton_hp_max"] = AUTOMATON_CHASSIS_SIZES[chassis].maxHp + qualityModifier;
            attributes[prefix + "automaton_coreRating"] = AUTOMATON_CHASSIS_SIZES[chassis].coreRating;
            attributes[prefix + "automaton_modules_max"] = AUTOMATON_CHASSIS_SIZES[chassis].maxModules + qualityModifier;
            setAttrs(attributes);
        }
    });
}