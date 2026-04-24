import { CalculateSlots } from "../helpers";

/**
 * @typedef {Object} Container
 * @property {number} size
 * @property {number} capacity
 */

/**
 * @type {Object.<string, Container>}
 */
const CONTAINERS = {
    "backpack": {
        size: 3,
        capacity: 30
    },
    "travel pack": {
        size: 5,
        capacity: 50
    }
};

export function UpdateBackContainer() {
    getAttrs(["containerBack_name"], function(values) {
        const container = values.containerBack_name || "";
        const listContainer = CONTAINERS[container.toLowerCase()];

        if(listContainer !== undefined) {
            setAttrs({
                containerBack_size: ""+listContainer.size,
                containerBack_capacity: listContainer.capacity
            });
        }
    });
}

export function UpdateBackItem(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_backitem_" + rowId + "_";

    getAttrs([prefix + "backitem_size", prefix + "backitem_count"], function(values) {
        const size = values[prefix + "backitem_size"] || "0";
        const count = parseInt(values[prefix + "backitem_count"]) || 0;

        let attributes = {};
        attributes[prefix + "backItem_slots"] = CalculateSlots(size, count);
        setAttrs(attributes);
    });
}

export function UpdateCarryCapacity() {
    getAttrs(["body", "athletics", "strongBonus", "weakPenalty"], function(values) {
        const body = parseInt(values.body)||0;
        const athletics = parseInt(values.athletics)||0;
        const strongBonus = parseInt(values.strongBonus)||0;
        const weakPenalty = parseInt(values.weakPenalty)||0;

        const athleticsBonus = Math.floor(athletics/2) * 5;
        let capacity = (body * 10) + athleticsBonus;

        if(strongBonus > 0)  {
            capacity = capacity * 2;
        }

        if(weakPenalty < 0) {
            capacity = Math.floor(capacity/2);
        }

        setAttrs({
            carryCapacity: "" + capacity + " Slots"
        });
    });
}

export function UpdateBackContainerLoad() {
    getSectionIDs("backItem", function(ids) {
        let load = 0;
        setAttrs({
            containerBack_load: load
        });

        for(var i = 0; i < ids.length; i++) {
            const prefix = "repeating_backitem_" + ids[i] + "_";

            getAttrs([prefix + "backItem_slots"], function(values) {
                load += parseInt(values[prefix + "backItem_slots"]) || 0;

                setAttrs({
                    containerBack_load: load
                });
            });
        }
    });
}

export function UpdateEquipment(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_equipment_" + rowId + "_";

    getAttrs([prefix + "equipment_size", prefix + "equipment_count"], function(values) {
        const size = values[prefix + "equipment_size"] || "0";
        const count = parseInt(values[prefix + "equipment_count"]) || 0;

        let attributes = {};
        attributes[prefix + "equipment_slots"] = CalculateSlots(size, count);
        setAttrs(attributes);
    });
}

export function UpdateLoad() {
    getAttrs(["containerBack_load", "containerBack_size", "containerBack_equip",
        "essence_fire", "essence_water", "essence_earth", "essence_air",
        "bolts", "plates", "wires", "cogs", "rods", "lenses", "gunpowder"
    ], function(values) {
        const backContainerIsEquipped = values.containerBack_equip == "on";
        
        // Essence Load
        const fireEssence = parseInt(values.essence_fire) || 0;
        const waterEssence = parseInt(values.essence_water) || 0;
        const earthEssence = parseInt(values.essence_earth) || 0;
        const airEssence = parseInt(values.essence_air) || 0;

        const essenceCount = fireEssence + waterEssence + earthEssence + airEssence;
        const essenceLoad = CalculateSlots("1/10", essenceCount);

        var load = essenceLoad;

        // Parts Load
        const bolts = parseInt(values.bolts) || 0;
        const plates = parseInt(values.plates) || 0;
        const wires = parseInt(values.wires) || 0;
        const cogs = parseInt(values.cogs) || 0;
        const rods = parseInt(values.rods) || 0;
        const lenses = parseInt(values.lenses) || 0;
        const gunpowder = parseInt(values.gunpowder) || 0;

        const partsLoad = CalculateSlots("1/20", bolts)
            + CalculateSlots("1/10", plates)
            + CalculateSlots("1/10", wires)
            + CalculateSlots("1/50", cogs)
            + CalculateSlots("1/10", rods)
            + CalculateSlots("1/50", lenses)
            + CalculateSlots("1/10", gunpowder);

        load += partsLoad;

        // Back Container Load
        if(backContainerIsEquipped) {
            const backContainerLoad = parseInt(values.containerBack_load) || 0;
            let backContainerSize = values.containerBack_size || "0";

            const backContainerSizeParts = backContainerSize.split("/");
            backContainerSize = parseInt(backContainerSizeParts[0]) || 0;

            load += backContainerSize + backContainerLoad;
        }

        setAttrs({
            inventory_load: "" + load + " Slots"
        });
        
        // Equipment Load
        getSectionIDs("equipment", function(ids) {
            for(var i = 0; i < ids.length; i++) {
                const prefix = "repeating_equipment_" + ids[i] + "_";

                getAttrs([prefix + "equipment_slots", prefix + "equipment_equip"], function(values) {
                    const isEquipped = values[prefix + "equipment_equip"] == 'on';

                    // Only count if the equipment is equipped
                    if(!isEquipped)
                        return;
                        
                    const slots = parseInt(values[prefix + "equipment_slots"]) || 0;
                    load += slots;

                    setAttrs({
                        inventory_load: "" + load + " Slots"
                    });
                });
            }
        });
    });
}