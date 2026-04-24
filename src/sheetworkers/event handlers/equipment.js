import { UpdateBackContainer, UpdateBackContainerLoad, UpdateBackItem, UpdateEquipment, UpdateLoad } from "../update functions/update-inventory";

on("change:repeating_equipment:equipment_size", UpdateEquipment);
on("change:repeating_equipment:equipment_count", UpdateEquipment);
on("change:repeating_equipment:equipment_slots", UpdateLoad);
on("change:repeating_equipment:equipment_equip", UpdateLoad);
on("remove:repeating_equipment", UpdateLoad);

on("change:repeating_backitem:backItem_size", UpdateBackItem);
on("change:repeating_backitem:backItem_count", UpdateBackItem);
on("change:repeating_backitem:backItem_slots", UpdateBackContainerLoad);
on("remove:repeating_backitem", UpdateLoad);

on("change:containerBack_name", UpdateBackContainer);
on("change:containerBack_load", UpdateLoad);
on("change:containerBack_size", UpdateLoad);
on("change:containerBack_equip", UpdateLoad);