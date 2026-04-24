export function UpdateBlueprintAutomatonChassis(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }
    
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_blueprint_" + rowId + "_";

    let attributes = {};

    switch(eventInfo.newValue.toLowerCase()) {
        case "small":
            attributes[prefix + "blueprint_minCR"] = 2;
            break;
        case "medium":
            attributes[prefix + "blueprint_minCR"] = 4;
            break;
        case "large":
            attributes[prefix + "blueprint_minCR"] = 6;
            break;
        default:
            return;
    }

    setAttrs(attributes);
}

export function UpdateBlueprintType(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }
    
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_blueprint_" + rowId + "_";

    let attributes = {};

    switch(eventInfo.newValue.toLowerCase()) {
        case "prosthetic":
            attributes[prefix + "blueprint_minCR"] = 1;
            break;
        case "automaton":
            getAttrs([prefix + "blueprint_automatonChassis"], function(values) {
                switch(values[prefix + "blueprint_automatonChassis"].toLowerCase()) {
                    case "small":
                        attributes[prefix + "blueprint_minCR"] = 2;
                        break;
                    case "medium":
                        attributes[prefix + "blueprint_minCR"] = 4;
                        break;
                    case "large":
                        attributes[prefix + "blueprint_minCR"] = 6;
                        break;
                    default:
                        return;
                }

                setAttrs(attributes);
            });

            return;
        case "autolimb":
            getAttrs([prefix + "blueprint_limb"], function(values) {
                const limb = values[prefix + "blueprint_limb"].toLowerCase();
                let attributes = {};

                switch(limb) {
                    case "arm":
                        attributes[prefix + "blueprint_minCR"] = 3;
                        break;
                    case "leg":
                        attributes[prefix + "blueprint_minCR"] = 3;
                        break;
                    case "hand":
                        attributes[prefix + "blueprint_minCR"] = 2;
                        break;
                    case "foot":
                        attributes[prefix + "blueprint_minCR"] = 2;
                        break;
                    case "ear":
                        attributes[prefix + "blueprint_minCR"] = 1;
                        break;
                    case "eye":
                        attributes[prefix + "blueprint_minCR"] = 1;
                        break;
                    case "nose":
                        attributes[prefix + "blueprint_minCR"] = 1;
                        break;
                    case "jaw":
                        attributes[prefix + "blueprint_minCR"] = 1;
                        break;
                }

                setAttrs(attributes);
            });

            return;
        default:
            return;
    }

    setAttrs(attributes);
}

export function UpdateBlueprintLimb(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }
    
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_blueprint_" + rowId + "_";

    getAttrs([prefix + "blueprint_type"], function(values) {
        const type = values[prefix + "blueprint_type"].toLowerCase();
        let attributes = {};

        if(type === "autolimb") {
            switch(eventInfo.newValue.toLowerCase()) {
                case "arm":
                    attributes[prefix + "blueprint_minCR"] = 3;
                    break;
                case "leg":
                    attributes[prefix + "blueprint_minCR"] = 3;
                    break;
                case "hand":
                    attributes[prefix + "blueprint_minCR"] = 2;
                    break;
                case "foot":
                    attributes[prefix + "blueprint_minCR"] = 2;
                    break;
                case "ear":
                    attributes[prefix + "blueprint_minCR"] = 1;
                    break;
                case "eye":
                    attributes[prefix + "blueprint_minCR"] = 1;
                    break;
                case "nose":
                    attributes[prefix + "blueprint_minCR"] = 1;
                    break;
                case "jaw":
                    attributes[prefix + "blueprint_minCR"] = 1;
                    break;
            }

            setAttrs(attributes);
        }
    });
}